'use strict';

const test = require('tape');
const stub = require('@cloudcmd/stub');
const mockRequire = require('mock-require');

require('css-modules-require-hook/preset');

const {
    open,
    close,
    _optionsStore,
    _onMainClick,
} = require('./modal');

const {
    create,
    autoGlobals,
} = require('./.spec/globals');

test('modal: open: main exist', autoGlobals((t) => {
    const el = {};
    const query = stub()
        .returns(el);
    
    mockRequire('./query', query);
    
    const {open} = mockRequire.reRequire('./modal');
    
    open({});
    
    t.ok(query.calledWith('main'), 'should call querySelector');
    t.end();
}));

test('modal: open: beforeShow', autoGlobals((t) => {
    const beforeShow = stub();
    const el = create();
    
    let called = false;
    const query = () => {
        if (called)
            return el;
        
        called = true;
    };
    
    mockRequire('./query', query);
    
    const {open} = mockRequire.reRequire('./modal');
    
    open({}, {
        beforeShow,
    });
    
    t.ok(beforeShow.calledWith(), 'should call querySelector');
    t.end();
}));

test('modal: open: showTitle', autoGlobals((t) => {
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
        }
    });
    
    mockRequire.stop('./query');
    mockRequire.stop('./show-title');
    
    t.ok(showTitle.calledWith('hello', el), 'should call querySelector');
    t.end();
}));

test('modal: open: no inner', (t) => {
    t.throws(open, /inner should be DOM-element/, 'should throw');
    t.end();
});

test('modal: open: images', autoGlobals((t) => {
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
    
    t.ok(parseImages.calledWith(el, inner, options), 'should call querySelector');
    t.end();
}));

test('modal: onMainClick', autoGlobals((t) => {
    const overlayClick = stub();
    const e = {
    };
    
    _onMainClick(overlayClick, e);
    
    t.ok(overlayClick.calledWith(e), 'should call overlayClick');
    t.end();
}));

test('modal: onMainClick: no main', autoGlobals((t) => {
    const overlayClick = stub();
    const e = {
        target: {}
    };
    
    _onMainClick(overlayClick, e);
    
    t.notOk(overlayClick.called, 'should not call overlayClick');
    t.end();
}));

test('modal: close: removeChild', autoGlobals((t, document) => {
    const el = {};
    const {querySelector, body} = document;
    querySelector.returns(el);
    
    close();
    
    t.ok(body.removeChild.calledWith(el), 'should call afterClose');
    t.end();
}));

test('modal: close: beforeClose', autoGlobals((t, {querySelector}) => {
    const beforeClose = stub();
    
    _optionsStore({
        beforeClose,
    });
    
    const el = {};
    querySelector.returns(el);
    
    close();
    
    t.ok(beforeClose.calledWith(), 'should call beforeClose');
    t.end();
}));

test('modal: close: afterClose', autoGlobals((t, {querySelector}) => {
    const afterClose = stub();
    
    _optionsStore({
        afterClose,
    });
    
    const el = {};
    querySelector.returns(el);
    
    close();
    
    t.ok(afterClose.calledWith(), 'should call afterClose');
    t.end();
}));

test('modal: close: no el', autoGlobals((t) => {
    const beforeClose = stub();
    
    _optionsStore({
        beforeClose,
    });
    
    close();
    
    t.notOk(beforeClose.called, 'should not call afterClose');
    t.end();
}));

