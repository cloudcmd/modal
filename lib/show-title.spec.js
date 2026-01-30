import autoGlobals from 'auto-globals';
import {
    test as tape,
    stub,
} from 'supertape';
import showTitle from './show-title.js';

const {create} = autoGlobals;
const test = autoGlobals(tape);

test('showTitle: should call query', (t) => {
    const title = 'hello';
    const parent = create();
    const query = stub();
    
    showTitle(title, parent, {
        query,
    });
    
    t.calledWith(query, ['title'], 'should call query');
    t.end();
});

test('showTitle: should call createElement', (t) => {
    const title = 'hello';
    const parent = create();
    const el = create();
    const createElement = stub().returns(el);
    
    showTitle(title, parent, {
        createElement,
    });
    
    const attrs = {
        parent: el,
        textContent: 'hello',
        className: 'modal-title-text',
        dataName: 'modal-title-text',
    };
    
    t.calledWith(createElement, ['span', attrs], 'should call query');
    t.end();
});

test('showTitle: should set title: element exist', (t) => {
    const title = 'hello';
    const parent = create();
    const el = {};
    
    const query = stub().returns(el);
    
    showTitle(title, parent, {
        query,
    });
    
    const expected = {
        textContent: 'hello',
    };
    
    t.deepEqual(el, expected);
    t.end();
});
