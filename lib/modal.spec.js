'use strict';

const tryCatch = require('try-catch');

const stub = require('@cloudcmd/stub');
const mockRequire = require('mock-require');

require('css-modules-require-hook/preset');

const {
    open,
    close,
    _optionsStore,
    _onMainClick,
} = require('./modal');

const autoGlobals = require('auto-globals');
const tape = require('supertape');

const {create} = autoGlobals;

const {
    reRequire,
    stopAll,
} = mockRequire;

const test = autoGlobals(tape);

test('modal: open: main exist', (t) => {
    const el = {};
    const query = stub()
        .returns(el);
    
    mockRequire('./query', query);
    
    const {open} = mockRequire.reRequire('./modal');
    
    open({});
    stopAll();
    
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
    
    mockRequire('./query', query);
    
    const {open} = reRequire('./modal');
    
    open({}, {
        beforeShow,
    });
    
    stopAll();
    
    t.ok(beforeShow.calledWith(), 'should call querySelector');
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
    
    mockRequire('./query', query);
    mockRequire('./show-title', showTitle);
    
    const {open} = mockRequire.reRequire('./modal');
    
    open({}, {
        beforeShow,
        title: 'hello',
        helpers: {
            title: true,
        },
    });
    
    mockRequire.stop('./query');
    mockRequire.stop('./show-title');
    
    stopAll();
    
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
    
    mockRequire('./query', query);
    mockRequire('./parse-images', parseImages);
    
    const {open} = mockRequire.reRequire('./modal');
    const images = [{
        title: 'hello',
        href: 'world',
    }];
    
    const afterShow = stub();
    open(images, {
        afterShow,
    });
    
    mockRequire.stop('./query');
    mockRequire.stop('./parse-images');
    
    const inner = [{
        title: 'hello',
        href: 'world',
    }];
    
    const options = {
        index: 0,
        afterShow,
        helpers: {},
    };
    
    stopAll();
    
    t.ok(parseImages.calledWith(el, inner, options), 'should call querySelector');
    t.end();
});

test('modal: onMainClick', (t) => {
    const overlayClick = stub();
    const e = {
        stopPropagation: stub(),
    };
    
    _onMainClick(overlayClick, e);
    
    t.calledWith(overlayClick, [e], 'should call overlayClick');
    t.end();
});

test('modal: onMainClick: no main', (t) => {
    const overlayClick = stub();
    const e = {
        target: {},
    };
    
    _onMainClick(overlayClick, e);
    
    t.notOk(overlayClick.called, 'should not call overlayClick');
    t.end();
});

test('modal: close: removeChild', (t, {document}) => {
    const el = {};
    const {
        querySelector,
        body,
    } = document;
    
    querySelector.returns(el);
    close();
    
    t.calledWith(body.removeChild, [el], 'should call afterClose');
    t.end();
});

test('modal: close: removeChild: event', (t, {document}) => {
    const el = {};
    const {
        querySelector,
        body,
    } = document;
    
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
    
    t.ok(beforeClose.calledWith(), 'should call beforeClose');
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
    
    t.ok(afterClose.calledWith(), 'should call afterClose');
    t.end();
});

test('modal: close: no el', (t) => {
    const beforeClose = stub();
    
    _optionsStore({
        beforeClose,
    });
    
    close();
    
    t.notOk(beforeClose.called, 'should not call afterClose');
    t.end();
});

