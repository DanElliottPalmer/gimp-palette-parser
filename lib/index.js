'use strict';

const path = require('path');
const parser = require('./parser');
const { loadFile, loadFileSync } = require('./utils');

module.exports = {
    parser,
    parseFile,
    parseFileSync
};

function parseFileSync(filename, name){
    const data = loadFileSync(filename);
    const baseName = name || path.basename(filename);
    return parser(baseName, data);
}

function parseFile(filename, name, cb){
    loadFile(filename, (data) => {
        const baseName = name || path.basename(filename);
        const parsedData = parser(baseName, data);
        cb(parsedData);
    });
}
