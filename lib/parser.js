'use strict';

const RE_COLUMN_SPLIT = /[ |\t]+/g;

let lines = null;
let currentLineNumber = -1;
let currentLine = null;

module.exports = parser;

function parseReset(){
    lines = null;
    currentLineNumber = -1;
    currentLine = null;
}

function parser(filename, fileInput){

    const palette = {
        name: null,
        columns: 0,
        colors: []
    };

    lines = fileInput.split('\n');
    gotoNextLine();

    /**
     * Header example:
     * 
     * GIMP Palette
     * Name: butts
     * Columns: 3
     * #
     * 
     */

    // All files should begin with GIMP Palette so check that first
    if(!currentLine.startsWith('GIMP Palette')){
        throw Error('Missing magic header.');
    }
    gotoNextLine();

    // Check for Name:
    if(currentLine.startsWith('Name: ')){
        palette.name = currentLine.substr('Name: '.length).trim();
        gotoNextLine();

        // Columns: x
        if(currentLine.startsWith('Columns: ')){
            var columns = parseInt(currentLine.substr('Columns: '.length), 10);
            if(columns < 0 || columns > 256){
                console.warn('Invalid number of columns. Using default.');
                columns = 0;
            }
            palette.columns = columns;
            gotoNextLine();
        }

    } else {
        palette.name = filename;
    }
    
    // Check for custom description lines and last #
    if(currentLine.startsWith('#')){
        do {
            gotoNextLine();
        } while(currentLine.startsWith('#'));
    } else {
        throw Error('Missing #');
    }

    const totalLines = lines.length;
    let lineValues = null;
    let r = 0;
    let g = 0;
    let b = 0;
    let name = null;
    while(currentLineNumber < totalLines){

        const line = currentLine.trim();

        if(line == ''){
            gotoNextLine();
            continue;
        }

        let r = token(line, ' \t');
        r = parseInt(r, 10);
        if(r < 0 || r > 255){
            console.warn('Red value is out of range.');
        }

        let g = token(null, ' \t');
        g = parseInt(g, 10);
        if(g < 0 || g > 255){
            console.warn('Green value is out of range.');
        }

        let b = token(null, ' \t');
        b = parseInt(b, 10);
        if(b < 0 || b > 255){
            console.warn('Blue value is out of range.');
        }

        name = token(null, '\n') || 'Untitled';

        palette.colors.push({ r: r, g: g, b: b, name: name });
        gotoNextLine();
    }

    parseReset();
    return palette;
}

function gotoNextLine(){
    currentLine = lines[++currentLineNumber];
}

function getNextLine(){
    let nextLineNumber = currentLineNumber;
    return lines[++nextLineNumber];
}

let tokenSource = null;
let tokenSourceLength = 0;
let tokenStart = 0;
let tokenPosition = 0;
function token(sourceString, tokenEndChars){
    if(sourceString){
        tokenSource = sourceString;
        tokenSourceLength = tokenSource.length;
        tokenStart = 0;
        tokenPosition = 0;
    }

    while(tokenPosition < tokenSourceLength){
        if(tokenEndChars.includes(tokenSource[tokenPosition])){
            // Check ahead in case the next token is the end character too
            if(tokenEndChars.includes(tokenSource[tokenPosition + 1])){
                tokenPosition++;
                continue;
            } else {
                tokenPosition++;
                break;
            }
        }
        tokenPosition++;
    }

    const token = tokenSource.substr(tokenStart, tokenPosition - tokenStart);
    tokenStart = tokenPosition;
    return token;
}
