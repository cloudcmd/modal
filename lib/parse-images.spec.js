import autoGlobals from 'auto-globals';
import {
    test as tape,
    stub,
} from 'supertape';
import parseImages, {
    _addListenerOnce,
    _rmListener,
    _onload,
    _onKeydown,
    _indexStore,
    _helpersStore,
} from './parse-images.js';

const {create} = autoGlobals;

const test = autoGlobals(tape);

test('parse-imagse: addListenerOnce', (t) => {
    const el = create();
    const fn = stub();
    
    _addListenerOnce(el, 'click', fn);
    
    t.ok(el.addEventListener.called, 'should call addEventListener');
    t.end();
});

test('parse-imagse: rmListener: removeEventListener', (t) => {
    const el = create();
    const fn = stub();
    
    const f = _rmListener(el, 'click', fn);
    const e = null;
    
    f(e);
    
    t.ok(el.removeEventListener.called, 'should call addEventListener');
    t.end();
});

test('parse-imagse: rmListener: fn', (t) => {
    const el = create();
    const fn = stub();
    
    const f = _rmListener(el, 'click', fn);
    const e = null;
    
    f(e);
    
    t.calledWith(fn, [e], 'should call fn');
    t.end();
});

test('parse-images: createElement', (t) => {
    const createElement = stub();
    const parent = create();
    const query = stub(create);
    
    const images = [{
        title: 'hello',
        href: 'world',
    }];
    
    parseImages(parent, images, {
        index: 0,
        helpers: {},
        query,
        createElement,
    });
    
    const options = {
        className: 'modal-nav modal-nav-right',
        dataName: 'modal-nav-right',
        innerHTML: '<span data-name="modal-next"></span>',
    };
    
    t.calledWith(createElement, ['div', options], 'should call createElement');
    t.end();
});

test('parse-images: showTitle', (t) => {
    const createElement = stub();
    const showTitle = stub();
    const parent = create();
    const el = create();
    
    const query = stub().returns(el);
    
    const images = [{
        title: 'hello',
        href: 'world',
    }];
    
    parseImages(parent, images, {
        index: 0,
        helpers: {
            title: true,
        },
        showTitle,
        createElement,
        query,
    });
    
    el.hidden = true;
    
    t.calledWith(showTitle, ['hello', el], 'should call showTitle');
    t.end();
});

test('parse-images: onKeydown: ArrowLeft', (t) => {
    const img = create();
    const el = create();
    
    const query = stub().returns(el);
    const images = [{
        title: 'hello',
        href: 'world',
    }, {
        title: 'hello2',
        href: 'world2',
    }];
    
    const ArrowLeft = 37;
    const f = _onKeydown(img, images, query);
    
    _indexStore(1);
    _helpersStore({});
    
    f({
        keyCode: ArrowLeft,
    });
    
    el.hidden = true;
    
    t.equal(img.title, 'hello');
    t.end();
});

test('parse-images: onKeydown: ArrowRight', (t) => {
    const img = create();
    const el = create();
    
    const query = stub().returns(el);
    const images = [{
        title: 'hello',
        href: 'world',
    }, {
        title: 'hello2',
        href: 'world2',
    }];
    
    const ArrowRight = 39;
    const f = _onKeydown(img, images, query);
    
    _indexStore(0);
    _helpersStore({});
    
    f({
        keyCode: ArrowRight,
    });
    
    el.hidden = true;
    
    t.equal(img.title, 'hello2');
    t.end();
});

test('parse-images: onKeydown: ArrowRight: dead end', (t) => {
    const img = create();
    const el = create();
    
    const query = stub().returns(el);
    
    img.title = 'abc';
    
    const images = [{
        title: 'hello',
        href: 'world',
    }, {
        title: 'hello2',
        href: 'world2',
    }];
    
    const ArrowRight = 39;
    const f = _onKeydown(img, images, query);
    
    _indexStore(1);
    _helpersStore({});
    
    f({
        keyCode: ArrowRight,
    });
    
    el.hidden = true;
    
    t.equal(img.title, 'abc');
    t.end();
});

test('parse-images: onKeydown: Esc', (t, {document}) => {
    const {body} = document;
    
    const img = create();
    const el = create();
    
    const query = stub().returns(el);
    
    img.title = 'abc';
    
    const images = [{
        title: 'hello',
        href: 'world',
    }, {
        title: 'hello2',
        href: 'world2',
    }];
    
    const Esc = 27;
    const f = _onKeydown(img, images, query);
    
    _indexStore(1);
    _helpersStore({});
    
    f({
        keyCode: Esc,
    });
    
    el.hidden = true;
    
    t.ok(body.removeEventListener.called, 'should call body.removeListener');
    t.end();
});

test('parse-images: onKeydown: other key', (t, {document}) => {
    const {body} = document;
    
    const img = create();
    const el = create();
    
    const query = stub().returns(el);
    
    img.title = 'abc';
    
    const images = [{
        title: 'hello',
        href: 'world',
    }, {
        title: 'hello2',
        href: 'world2',
    }];
    
    const f = _onKeydown(img, images, query);
    
    _indexStore(1);
    _helpersStore({});
    
    f({
        keyCode: 1,
    });
    
    el.hidden = true;
    
    t.notCalled(body.removeEventListener, 'should not call body.removeListener');
    t.end();
});

test('parse-images: onload: parent', (t) => {
    const afterShow = stub();
    const parent = {};
    
    const f = _onload(parent, afterShow);
    
    f();
    
    t.notOk(parent.hidden, 'should not be hidden');
    t.end();
});

test('parse-images: onload: afterShow', (t) => {
    const afterShow = stub();
    const parent = {};
    
    const f = _onload(parent, afterShow);
    
    f();
    
    t.calledWithNoArgs(afterShow, 'should call afterShow');
    t.end();
});
