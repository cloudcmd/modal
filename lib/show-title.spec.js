'use strict';

const mockRequire = require('mock-require');

const stub = require('@cloudcmd/stub');

const autoGlobals = require('auto-globals');
const {stopAll} = mockRequire;
const {create} = autoGlobals;

const test = autoGlobals(require('supertape'));

test('showTitle: should call query', (t) => {
    const title = 'hello';
    const parent = create();
    const query = stub();
    
    mockRequire('./query', query);
    const showTitle = mockRequire.reRequire('./show-title');
    
    showTitle(title, parent);
    
    mockRequire.stop('./query');
    
    stopAll();
    
    t.calledWith(query, ['title'], 'should call query');
    t.end();
});

test('showTitle: should call createElement', (t) => {
    const title = 'hello';
    const parent = create();
    const el = create();
    const createElement = stub().returns(el);
    
    mockRequire('@cloudcmd/create-element', createElement);
    
    const showTitle = mockRequire.reRequire('./show-title');
    
    showTitle(title, parent);
    
    mockRequire.stop('@cloudcmd/create-element');
    
    const attrs = {
        parent: el,
        textContent: 'hello',
        className: 'modal-title-text',
        dataName: 'modal-title-text',
    };
    
    stopAll();
    
    t.calledWith(createElement, ['span', attrs], 'should call query');
    t.end();
});

test('showTitle: should set title: element exist', (t) => {
    const title = 'hello';
    const parent = create();
    const el = {};
    const query = stub()
        .returns(el);
    
    mockRequire('./query', query);
    
    const showTitle = mockRequire.reRequire('./show-title');
    
    showTitle(title, parent);
    
    mockRequire.stop('./query');
    
    const expected = {
        textContent: 'hello',
    };
    
    stopAll();
    
    t.deepEqual(el, expected);
    t.end();
});

