# gimp palette parser

> Parses .gpl files

## Install

```
$ npm install --save gimp-palette-parser
```

## Usage

```js
const parser = require('gimp-palette-parser');

parser.parseFile('butts.gpl', (data) => {
    console.log('loaded');
});
```