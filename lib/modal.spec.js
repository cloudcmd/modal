import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {tryCatch} = require('try-catch');

const autoGlobals = require('auto-globals');
const {test: tape, stub} = require('supertape');

const {
    open,
    close,
    _optionsStore,
    _onMainClick,
} = require('./modal');

const {create} = autoGlobals;
const test = autoGlobals(tape);

test('modal: open: main exist', (t) => {
    const el = {};
    const query = stub().returns(el);
    
    open({}, {
        query,
    });
    
    t.calledWith(query, ['main'], 'should call querySelector');
    t.end();
});

test('modal: open: beforeShow', (t) => {
    const beforeShow = stub();
    const el = create();
    
    let called = false;
    const query = () => {
        if (called)
            return el;
        
        called = true;
    };
    
    open({}, {
        beforeShow,
        query,
    });
    
    t.calledWithNoArgs(beforeShow, 'should call querySelector');
    t.end();
});

test('modal: open: showTitle', (t) => {
    const beforeShow = stub();
    const el = create();
    
    let called = false;
    const query = () => {
        if (called)
            return el;
        
        called = true;
    };
    
    const showTitle = stub();
    
    open({}, {
        query,
        showTitle,
        beforeShow,
        title: 'hello',
        helpers: {
            title: true,
        },
    });
    
    t.calledWith(showTitle, ['hello', el], 'should call querySelector');
    t.end();
});

test('modal: open: no inner', (t) => {
    const [error] = tryCatch(open);
    
    t.equal(error.message, 'inner should be DOM-element!', 'should throw');
    t.end();
});

test('modal: open: images', (t) => {
    const el = create();
    
    let called = false;
    const query = () => {
        if (called)
            return el;
        
        called = true;
    };
    
    const parseImages = stub();
    
    const images = [{
        title: 'hello',
        href: 'world',
    }];
    
    const afterShow = stub();
    
    open(images, {
        query,
        afterShow,
        parseImages,
    });
    
    const inner = [{
        title: 'hello',
        href: 'world',
    }];
    
    const options = {
        index: 0,
        afterShow,
        helpers: {},
    };
    
    t.calledWith(parseImages, [el, inner, options], 'should call querySelector');
    t.end();
});

test('modal: onMainClick', (t) => {
    const overlayClick = stub();
    const e = {
        stopPropagation: stub(),
    };
    
    const click = _onMainClick(overlayClick);
    
    click(e);
    
    t.calledWith(overlayClick, [e], 'should call overlayClick');
    t.end();
});

test('modal: onMainClick: no main', (t) => {
    const overlayClick = stub();
    const e = {
        target: {},
    };
    
    const query = stub();
    
    const click = _onMainClick(overlayClick, {
        query,
    });
    
    click(e);
    
    t.notCalled(overlayClick, 'should not call overlayClick');
    t.end();
});

test('modal: close: removeChild', (t, {document}) => {
    const el = {};
    const {querySelector, body} = document;
    
    querySelector.returns(el);
    close();
    
    t.calledWith(body.removeChild, [el], 'should call afterClose');
    t.end();
});

test('modal: close: removeChild: event', (t, {document}) => {
    const el = {};
    const {querySelector, body} = document;
    
    querySelector.returns(el);
    close();
    
    t.calledWith(body.removeChild, [el], 'should call afterClose');
    t.end();
});

test('modal: close: beforeClose', (t, {document}) => {
    const {querySelector} = document;
    const beforeClose = stub();
    
    _optionsStore({
        beforeClose,
    });
    
    const el = {};
    querySelector.returns(el);
    
    close();
    
    t.calledWithNoArgs(beforeClose, 'should call beforeClose');
    t.end();
});

test('modal: close: afterClose', (t, {document}) => {
    const {querySelector} = document;
    const afterClose = stub();
    
    _optionsStore({
        afterClose,
    });
    
    const el = {};
    querySelector.returns(el);
    
    close();
    
    t.calledWithNoArgs(afterClose, 'should call afterClose');
    t.end();
});

test('modal: close: no el', (t) => {
    const beforeClose = stub();
    
    _optionsStore({
        beforeClose,
    });
    
    close();
    
    t.notCalled(beforeClose, 'should not call afterClose');
    t.end();
});
