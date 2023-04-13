---
sidebar_position: 2
hide_table_of_contents: false
title: Install Evidence
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="standalone" label="Stand-alone" default>

```shell
npx degit evidence-dev/template my-project
cd my-project
npm install
npm run dev
```

<p class="standard-margin">Open your browser and go to <a href="http://localhost:3000">http://localhost:3000</a></p>

</TabItem>

<TabItem value="dbt" label="With dbt">

```shell
cd path/to/your/dbt/project
npx degit evidence-dev/template reports
npm --prefix ./reports install
npm --prefix ./reports run dev
```

<p class="standard-margin">If you use dbt, it is suggested you install Evidence inside your dbt project, inside a folder called <code>reports</code>, creating a <a href="https://github.com/archiewood/analytics_monorepo">monorepo</a>.</p>
<p class="standard-margin">This currently needs to be done from the terminal, rather than from the dbt Cloud UI.</p>
<p class="standard-margin">This allows changes across your modelling layer (in <code>/models</code>) and your reporting layer (in <code>reports</code>) in the same commits.</p>
<p class="standard-margin">Open your browser and go to <a href="http://localhost:3000">http://localhost:3000</a></p>

</TabItem>

<TabItem value="codespaces" label="Codespaces">

1. In the <a href="https://github.com/evidence-dev/template/" alt="template repo">template repo</a> click the green "Use this template" button, and select "Open in a Codespace".
1. Wait for the codespace to start up
1. In the terminal in the Codespace, run:

```shell
npm install
npm run dev -- --host 0.0.0.0
```

**Note:** Codespaces is much faster on the Desktop app. After the Codespace has booted, select the hamburger menu &rarr; Open in VS Code Desktop.

</TabItem>

<TabItem value="docker" label="Docker">
<p class="standard-margin">Evidence provides a development Docker image.</p>
<p class="standard-margin">See our <a href="https://github.com/evidence-dev/docker-devenv">Docker Development Environment repository</a> for instructions.</p>
</TabItem>
</Tabs>

<hr/>

The <code>template</code> project running in your browser contains a tutorial on how to use Evidence.

_Need step by step instructions? Visit our [Detailed Installation Walkthrough.](/guides/installation)_

## System Requirements

Evidence requires:

- **Node.js** `Version 16.14` or higher
- **NPM** `Version 7` or higher

Check your versions with `node -v` and `npm -v`

- Update to the latest npm version with `npm install -g npm@latest`

<a class="external" href="https://nodejs.org/en/download">Download Node.js + NPM</a>

## VS Code Extension

If you use VS Code, we recommend installing the [Evidence VSCode Extension](https://marketplace.visualstudio.com/items?itemName=Evidence.evidence-vscode). It adds syntax highlighting and autocomplete for Evidence flavoured markdown.
