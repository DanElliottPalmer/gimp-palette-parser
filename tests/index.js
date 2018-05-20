const path = require('path');

import test from 'ava';

import { parseFileSync } from '../lib/index';

const TEST_OLD_FORMAT = path.join(__dirname, 'old_format.gpl');
const TEST_NEW_FORMAT = path.join(__dirname, 'new_format.gpl');
const TEST_CUSTOM_FORMAT = path.join(__dirname, 'custom_format.gpl');
const TEST_MISSING_HEADER = path.join(__dirname, 'missing_header.gpl');

test('Old format', t => {
    const parsedData = parseFileSync(TEST_OLD_FORMAT, 'Old format');
    t.deepEqual(parsedData, {
        name: 'Old format',
        columns: 0,
        colors: [{
            r: 155,
            g: 188,
            b: 15,
            name: 'Row 1'
        },{
            r: 139,
            g: 172,
            b: 15,
            name: 'Untitled'
        },{
            r: 48,
            g: 98,
            b: 48,
            name: 'Untitled'
        },{
            r: 15,
            g: 56,
            b: 15,
            name: 'Row 4'
        }]
    });
});

test('New format', t => {
    const parsedData = parseFileSync(TEST_NEW_FORMAT, 'New format');
    t.deepEqual(parsedData, {
        name: 'Gameboy',
        columns: 0,
        colors: [{
            r: 155,
            g: 188,
            b: 15,
            name: 'Untitled'
        },{
            r: 139,
            g: 172,
            b: 15,
            name: 'Row 2'
        },{
            r: 48,
            g: 98,
            b: 48,
            name: 'Row 3'
        },{
            r: 15,
            g: 56,
            b: 15,
            name: 'Row 4'
        }]
    });
});

test('Custom format', t => {
    const parsedData = parseFileSync(TEST_CUSTOM_FORMAT);
    t.deepEqual(parsedData, {
        name: 'custom_format.gpl',
        columns: 0,
        colors: [{
            r: 155,
            g: 188,
            b: 15,
            name: 'Untitled'
        },{
            r: 139,
            g: 172,
            b: 15,
            name: 'Row 2'
        },{
            r: 48,
            g: 98,
            b: 48,
            name: 'Untitled'
        },{
            r: 15,
            g: 56,
            b: 15,
            name: 'Row 4'
        }]
    });
});

test('Missing header', t => {
    t.throws(() => {
        const parsedData = parseFileSync(TEST_MISSING_HEADER, 'Missing header');
    }, Error);
});
