'use strict';

const test = require('tape');
const createElement = require('./create-element');
const {isElementPresent} = createElement;
const {
    create,
    autoGlobals,
} = require('./.spec/globals');

test('create-element: isElementPresent', (t) => {
    const result = isElementPresent();
    
    t.notOk(result, 'should be not ok');
    t.end();
});

test('create-element: isElementPresent', autoGlobals((t, {querySelector}) => {
    const el = {};
    
    querySelector
            .returns(el)
    
    const result = isElementPresent('hello');
    
    t.equal(result, el, 'should equal');
    t.end();
}));

test('create-element: found', autoGlobals((t, {querySelector}) => {
    const el = {};
    
    querySelector.returns(el)
    
    const parent = create();
    const result = createElement('div', {
        parent,
        dataName: 'hello',
    });
    
    t.equal(result, el, 'should equal');
    t.end();
}));

test('create-element: innerHTML', autoGlobals((t) => {
    const innerHTML = 'hello';
    const parent = create();
    
    const el = createElement('div', {
        parent,
        innerHTML,
    });
    
    t.equal(el.innerHTML, innerHTML, 'should equal');
    t.end();
}));

test('create-element: textContent', autoGlobals((t) => {
    const textContent = 'hello';
    const parent = create();
    
    const el = createElement('div', {
        parent,
        textContent,
    });
    
    t.equal(el.textContent, textContent, 'should equal');
    t.end();
}));

test('create-element: no parent', autoGlobals((t, {body}) => {
    const el = createElement('div');
    
    t.ok(body.appendChild.calledWith(el), 'should call body.appendChild');
    t.end();
}));

