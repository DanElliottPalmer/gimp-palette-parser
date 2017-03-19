'use strict';

const fs = require('fs');

module.exports = {
    loadFile,
    loadFileSync
};

function loadFile(filename, cb){
    fs.readFile(filename, { encoding: 'utf8' }, (err, data) => {
        if(err) throw err;
        cb(data);
    });
}

function loadFileSync(filename){
    return fs.readFileSync(filename, { encoding: 'utf8' });
}
