'use strict';

const test = require('supertape');
const getClassName = require('./get-class-name');

test('get-class-name: no', (t) => {
    const result = getClassName({});
    
    const expected = 'modal-main';
    
    t.equal(result, expected);
    t.end();
});

test('get-class-name: autoSize', (t) => {
    const autoSize = true;
    const result = getClassName({
        autoSize,
    });
    
    const expected = 'modal-main modal-autosize';
    
    t.equal(result, expected);
    t.end();
});

test('get-class-name: isTitle', (t) => {
    const isTitle = true;
    const result = getClassName({
        isTitle,
    });
    
    const expected = 'modal-main modal-is-title';
    
    t.equal(result, expected);
    t.end();
});

test('get-class-name: autoSize, isTitle', (t) => {
    const autoSize = true;
    const isTitle = true;
    const result = getClassName({
        autoSize,
        isTitle,
    });
    
    const expected = 'modal-main modal-autosize modal-is-title';
    
    t.equal(result, expected);
    t.end();
});

