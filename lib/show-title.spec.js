'use strict';

const test = require('tape');
const stub = require('@cloudcmd/stub');
const mockRequire = require('mock-require');
const {
    create,
    autoGlobals,
} = require('./.spec/globals');

test('showTitle: should call query', autoGlobals((t) => {
    const title = 'hello';
    const parent = create();
    const query = stub();
    
    mockRequire('./query', query);
    const showTitle = mockRequire.reRequire('./show-title');
    
    showTitle(title, parent);
    
    mockRequire.stop('./query');
    
    t.ok(query.calledWith('title'), 'should call query');
    t.end();
}));

test('showTitle: should call createElement', autoGlobals((t) => {
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
    
    t.ok(createElement.calledWith('span', attrs), 'should call query');
    t.end();
}));

test('showTitle: should set title: element exist', autoGlobals((t) => {
    const title = 'hello';
    const parent = create();
    const el = {};
    const query= stub()
        .returns(el);
    
    mockRequire('./query', query);
    
    const showTitle = mockRequire.reRequire('./show-title');
    
    showTitle(title, parent);
    
    mockRequire.stop('./query');
    
    const expected = {
        textContent: 'hello',
    };
    
    t.deepEqual(el, expected, 'should equal');
    t.end();
}));

