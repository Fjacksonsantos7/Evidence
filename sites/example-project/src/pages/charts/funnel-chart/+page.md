<script>
    let funnelData = [
    { value: 60, name: 'Visit' },
    { value: 40, name: 'Inquiry' },
    { value: 20, name: 'Order' },
    { value: 80, name: 'Click' },
    { value: 100, name: 'Show' }
]
</script>

<FunnelChart data={funnelData} nameCol=name valueCol=value title="Funnel Chart" subtitle="Simple Funnel Chart" outlineColor="white" />
