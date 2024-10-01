import {
	RecordBatchStreamWriter,
	Schema,
	Field,
	Float64,
	Utf8,
	TimestampMillisecond,
	Bool,
	Message
} from 'apache-arrow';
import { RecordBatch, BufferRegion, FieldNode } from 'apache-arrow/ipc/metadata/message';

/**
 * Converts directly from an array of JS objects to an Arrow IPC buffer
 * @param {Record<string, unknown>[]} data
 * @param {{ name: string; evidenceType: string; }[]} columns
 * @returns {Uint8Array}
 */
export function jsToIPC(data, columns) {
	const schema = new Schema(
		columns.map((c) => new Field(c.name, evidenceToArrowType(c.evidenceType), true))
	);

	const writer = new JSStreamWriter();
	writer.reset(undefined, schema);
	writer._writeArray(data)
	return writer.finish().toUint8Array(true);
}

function evidenceToArrowType(evidenceType) {
	switch (evidenceType) {
		case 'number':
			return new Float64();
		case 'string':
			return new Utf8();
		case 'date':
			// TODO: What gives with timezones
			return new TimestampMillisecond();
		case 'boolean':
			return new Bool();
		default:
			throw new Error(
				'Unrecognized EvidenceType: ' +
				column.evidenceType +
				'\n This is likely an error in a datasource connector.'
			);
	}
}

class JSStreamWriter extends RecordBatchStreamWriter {
	_writeArray(arr) {
		const accumulator = {
			byteLength: 0,
			nodes: [],
			buffers: [],
			bufferRegions: [],
		};

		for (const { name, type } of this._schema.fields) {
			if (type instanceof Float64) writeFloat64Array(accumulator, arr, name);
			else if (type instanceof Utf8) writeUtf8Array(accumulator, arr, name);
			else if (type instanceof TimestampMillisecond) writeTimestampArray(accumulator, arr, name);
			else if (type instanceof Bool) writeBoolArray(accumulator, arr, name);
			else throw new Error(`Unsupported type: ${type}`);
		}

		const { byteLength, nodes, bufferRegions, buffers } = accumulator;
		const recordBatch = new RecordBatch(arr.length, nodes, bufferRegions);
		const message = Message.from(recordBatch, byteLength);
		return this
			// ._writeDictionaries(batch)
			._writeMessage(message)
			._writeBodyBuffers(buffers);
	}
}

function addBuffer(values) {
	const byteLength = (values.byteLength + 7) & ~7; // Round up to a multiple of 8
	this.buffers.push(values);
	this.bufferRegions.push(new BufferRegion(this.byteLength, byteLength));
	this.byteLength += byteLength;
	return this;
}

function setBit(bitmap, i, value) {
	const byte = i >>> 3;
	const bit = 1 << (i % 8);
	if (value) bitmap[byte] |= bit;
	else bitmap[byte] &= ~bit;
}

function writeFloat64Array(accumulator, arr, name) {
	let nullCount = 0;
	const nulls = new Uint8Array(arr.length / 8);
	const values = new Float64Array(arr.length);
	for (let i = 0; i < arr.length; i++) {
		const el = arr[i][name];
		if (el != null) {
			setBit(nulls, i, 1);
			values[i] = Number(el);
		} else {
			nullCount++;
			values[i] = 0;
		}
	}

	// this comes from `VectorAssembler.visit` in apache-arrow/visitor/vectorassembler.mjs
	accumulator.nodes.push(new FieldNode(arr.length, nullCount));

	addBuffer.call(accumulator, nulls);
	addBuffer.call(accumulator, values);
}

function writeBoolArray(accumulator, arr, name) {
	let nullCount = 0;
	const nulls = new Uint8Array(arr.length / 8);
	// adapted from `packBools` in apache-arrow/util/bit.js
	const bytes = new Uint8Array(((arr.length / 8) + 7) & ~7);
	for (let i = 0; i < arr.length; i++) {
		const el = arr[i][name];
		if (el != null) {
			setBit(nulls, i, 1);
			if (el) bytes[i / 8] |= 1 << (i % 8);
		} else {
			nullCount++;
		}
	}

	accumulator.nodes.push(new FieldNode(arr.length, nullCount));

	addBuffer.call(accumulator, nulls);
	addBuffer.call(accumulator, bytes);
}

const encoder = new TextEncoder();
function serializeString(str, dest, ptr) {
	const len = str.length;

	// stolen from [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen/blob/cf186acf48c4b0649934d19ba1aa18282bd2ec44/crates/cli/tests/reference/string-arg.js#L46)
	let length = 0;
	for (; length < len; length++) {
		const code = str.charCodeAt(length);
		if (code > 0x7f) break;
		dest[ptr + length] = code;
	}

	if (length !== len) {
		if (length !== 0) {
			str = str.slice(length);
		}

		length += encoder.encodeInto(str, dest.subarray(ptr + length)).written;
	}

	return length;
}

function writeUtf8Array(accumulator, arr, name) {
	let nullCount = 0;
	const nulls = new Uint8Array(arr.length / 8);

	let byteLength = 0;
	const valueOffsets = new Uint32Array(arr.length + 1);
	let values = new Uint8Array(1);
	for (let i = 0; i < arr.length; i++) {
		const str = arr[i][name]?.toString();
		if (str != null) {
			setBit(nulls, i, 1);

			let size = values.length;
			while (size < byteLength + str.length * 3) size *= 2;
			if (size !== values.length) {
				// when we're at a newer version of node this can use Uint8Array.prototype.transfer
				const newValues = new Uint8Array(size);
				newValues.set(values);
				values = newValues;
			}
			valueOffsets[i + 1] = byteLength += serializeString(str, values, byteLength);
		} else {
			nullCount++;
			valueOffsets[i + 1] = byteLength;
		}
	}

	accumulator.nodes.push(new FieldNode(arr.length, nullCount));

	addBuffer.call(accumulator, nulls);
	addBuffer.call(accumulator, valueOffsets);
	addBuffer.call(accumulator, values.subarray(0, byteLength));
}

function writeTimestampArray(accumulator, arr, name) {
	let nullCount = 0;
	const nulls = new Uint8Array(arr.length);
	const values = new Int32Array(arr.length * 2);
	for (let i = 0; i < arr.length; i++) {
		const el = arr[i][name];
		if (el != null) {
			setBit(nulls, i, 1);

			// logic from `setEpochMsToMillisecondsLong`
			const epochMs = el.valueOf();
			values[2 * i] = Math.trunc(epochMs % 4294967296);
			values[2 * i + 1] = Math.trunc(epochMs / 4294967296);
		} else {
			nullCount++;
			values[2 * i] = 0;
			values[2 * i + 1] = 0;
		}
	}

	accumulator.nodes.push(new FieldNode(arr.length, nullCount));

	addBuffer.call(accumulator, nulls);
	addBuffer.call(accumulator, values);
}
