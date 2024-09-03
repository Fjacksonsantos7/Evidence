---
title: Tabs
sidebar_position: 1
---


<Tabs>
    <Tab label="First Tab">
        Content of the First Tab

        You can use **markdown** here too!
    </Tab>
    <Tab label="Second Tab">
        Content of the Second Tab

        Here's a [link](https://www.google.com)
    </Tab>
</Tabs>



```markdown
<Tabs>
    <Tab label="First Tab">
        Content of the First Tab

        You can use **markdown** here too!
    </Tab>
    <Tab label="Second Tab">
        Content of the Second Tab

        Here's a [link](https://www.google.com)
    </Tab>
</Tabs>
```

## Examples

### Custom Color


<Tabs color=#ff0000>
    <Tab label="Red Tabs">
        Content of the First Tab
    </Tab>
    <Tab label="Second Tab">
        Content of the Second Tab
    </Tab>
</Tabs>

```markdown
<Tabs color=#ff0000>
    <Tab label="Red Tabs">
        Content of the First Tab
    </Tab>
    <Tab label="Second Tab">
        Content of the Second Tab
    </Tab>
</Tabs>
```

### ID

<Tabs id="first tab set">
    <Tab label="First Id tab">
        Click Second id Tab and notice the the url updates!
    </Tab>
    <Tab label="Second Id tab">
        Refresh the page and the tab you selected persists!
    </Tab>
</Tabs>


```markdown
<Tabs id="first tab set">
    <Tab label="First Id tab">
        Click Second id Tab and notice the the url updates!
    </Tab>
    <Tab label="Second Id tab">
        Refresh the page and the tab you selected persists!
    </Tab>
</Tabs>
```

# Tabs

## Options

<PropListing
    name="id"
    options="string"
>

Unique Id for this set of tabs. When set, the selected tab is included in the URL so it can be shared.

</PropListing>
<PropListing
    name="color"
    options="Any valid hex, rgb, or hsl string"
    defaultValue="blue"
>

Color for the active tab.

</PropListing>

# Tab

## Options

<PropListing
    name="label"
    required
>

Label for the tab

</PropListing>
<PropListing
    name="id"
>

Unique Id for this tab. Only needed if 2 tabs have the same label (not recommended).

</PropListing>