'use strict';

const test = require('tape');
const mockRequire = require('mock-require');
const diff = require('sinon-called-with-diff');
const sinon = diff(require('sinon'));

const parseImages = require('./parse-images');
const {
    _addListenerOnce,
    _rmListener,
    _onload,
} = parseImages;

const {
    autoGlobals,
    create,
} = require('./.spec/globals');

test('parse-imagse: addListenerOnce', (t) => {
    const el = create();
    const fn = sinon.stub();
    
    _addListenerOnce(el, 'click', fn)
    
    t.ok(el.addEventListener.called, 'should call addEventListener');
    t.end();
});

test('parse-imagse: rmListener: removeEventListener', (t) => {
    const el = create();
    const fn = sinon.stub();
    
    const f = _rmListener(el, 'click', fn)
    const e = null;
    
    f(e);
    
    t.ok(el.removeEventListener.called, 'should call addEventListener');
    t.end();
});

test('parse-imagse: rmListener: fn', (t) => {
    const el = create();
    const fn = sinon.stub();
    
    const f = _rmListener(el, 'click', fn)
    const e = null;
    
    f(e);
    
    t.ok(fn.calledWith(e), 'should call fn');
    t.end();
});

test('parse-images', autoGlobals((t) => {
    const createElement = sinon.stub();
    const parent = create();
    const query = sinon
        .stub()
        .returns(create());
    
    mockRequire('./query', query);
    mockRequire('@cloudcmd/create-element', createElement);
    
    const parseImages = mockRequire.reRequire('./parse-images');
    const images = [{
        title: 'hello',
        href: 'world',
    }];
    
    parseImages(parent, images, {
        index: 0,
        helpers: {},
    })
    
    const options = {
        className: 'modal-nav modal-nav-right',
        dataName: 'modal-nav-right',
        innerHTML: '<span data-name="modal-next"></span>',
    };
    
    mockRequire.stop('./query');
    mockRequire.stop('@cloudcmd/create-element');
    
    t.ok(createElement.calledWith('div', options), 'should call createElement');
    t.end();
}));

test('parse-images: showTitle', autoGlobals((t) => {
    const createElement = sinon.stub();
    const showTitle = sinon.stub();
    const parent = create();
    const el = create();
    const query = sinon
        .stub()
        .returns(el);
    
    mockRequire('./query', query);
    mockRequire('@cloudcmd/create-element', createElement);
    mockRequire('./show-title', showTitle);
    
    const parseImages = mockRequire.reRequire('./parse-images');
    const images = [{
        title: 'hello',
        href: 'world',
    }];
    
    parseImages(parent, images, {
        index: 0,
        helpers: {
            title: true
        },
    })
    
    mockRequire.stop('./query');
    mockRequire.stop('@cloudcmd/create-element');
    mockRequire.stop('./show-title');
    
    el.hidden = true;
    
    t.ok(showTitle.calledWith('hello', el), 'should call showTitle');
    t.end();
}));

test('parse-images: onKeydown: ArrowLeft', autoGlobals((t) => {
    const createElement = sinon.stub();
    const img = create();
    const el = create();
    const query = sinon
        .stub()
        .returns(el);
    
    mockRequire('./query', query);
    mockRequire('@cloudcmd/create-element', createElement);
    
    const {
        _onKeydown,
        _indexStore,
        _helpersStore,
    } = mockRequire.reRequire('./parse-images');
    
    const images = [{
        title: 'hello',
        href: 'world',
    }, {
        title: 'hello2',
        href: 'world2',
    }];
    
    const ArrowLeft = 37;
    const f = _onKeydown(img, images);
    
    _indexStore(1);
    _helpersStore({});
    
    f({
        keyCode: ArrowLeft
    });
    
    mockRequire.stop('./query');
    mockRequire.stop('@cloudcmd/create-element');
    
    el.hidden = true;
    
    t.equal(img.title, 'hello', 'should equal');
    t.end();
}));

test('parse-images: onKeydown: ArrowRight', autoGlobals((t) => {
    const createElement = sinon.stub();
    const img = create();
    const el = create();
    const query = sinon
        .stub()
        .returns(el);
    
    mockRequire('./query', query);
    mockRequire('@cloudcmd/create-element', createElement);
    
    const {
        _onKeydown,
        _indexStore,
        _helpersStore,
    } = mockRequire.reRequire('./parse-images');
    
    const images = [{
        title: 'hello',
        href: 'world',
    }, {
        title: 'hello2',
        href: 'world2',
    }];
    
    const ArrowRight = 39;
    const f = _onKeydown(img, images);
    
    _indexStore(0);
    _helpersStore({});
    
    f({
        keyCode: ArrowRight,
    });
    
    mockRequire.stop('./query');
    mockRequire.stop('@cloudcmd/create-element');
    
    el.hidden = true;
    
    t.equal(img.title, 'hello2', 'should equal');
    t.end();
}));

test('parse-images: onKeydown: ArrowRight: dead end', autoGlobals((t) => {
    const createElement = sinon.stub();
    const img = create();
    const el = create();
    const query = sinon
        .stub()
        .returns(el);
    
    img.title = 'abc';
    
    mockRequire('./query', query);
    mockRequire('@cloudcmd/create-element', createElement);
    
    const {
        _onKeydown,
        _indexStore,
        _helpersStore,
    } = mockRequire.reRequire('./parse-images');
    
    const images = [{
        title: 'hello',
        href: 'world',
    }, {
        title: 'hello2',
        href: 'world2',
    }];
    
    const ArrowRight = 39;
    const f = _onKeydown(img, images);
    
    _indexStore(1);
    _helpersStore({});
    
    f({
        keyCode: ArrowRight,
    });
    
    mockRequire.stop('./query');
    mockRequire.stop('@cloudcmd/create-element');
    
    el.hidden = true;
    
    t.equal(img.title, 'abc', 'should equal');
    t.end();
}));

test('parse-images: onKeydown: Esc', autoGlobals((t, {body}) => {
    const createElement = sinon.stub();
    const img = create();
    const el = create();
    const query = sinon
        .stub()
        .returns(el);
    
    img.title = 'abc';
    
    mockRequire('./query', query);
    mockRequire('@cloudcmd/create-element', createElement);
    
    const {
        _onKeydown,
        _indexStore,
        _helpersStore,
    } = mockRequire.reRequire('./parse-images');
    
    const images = [{
        title: 'hello',
        href: 'world',
    }, {
        title: 'hello2',
        href: 'world2',
    }];
    
    const Esc = 27;
    const f = _onKeydown(img, images);
    
    _indexStore(1);
    _helpersStore({});
    
    f({
        keyCode: Esc,
    });
    
    mockRequire.stop('./query');
    mockRequire.stop('@cloudcmd/create-element');
    
    el.hidden = true;
    
    t.ok(body.removeEventListener.called, 'should call body.removeListener');
    t.end();
}));

test('parse-images: onKeydown: other key', autoGlobals((t, {body}) => {
    const createElement = sinon.stub();
    const img = create();
    const el = create();
    const query = sinon
        .stub()
        .returns(el);
    
    img.title = 'abc';
    
    mockRequire('./query', query);
    mockRequire('@cloudcmd/create-element', createElement);
    
    const {
        _onKeydown,
        _indexStore,
        _helpersStore,
    } = mockRequire.reRequire('./parse-images');
    
    const images = [{
        title: 'hello',
        href: 'world',
    }, {
        title: 'hello2',
        href: 'world2',
    }];
    
    const f = _onKeydown(img, images);
    
    _indexStore(1);
    _helpersStore({});
    
    f({
        keyCode: 1,
    });
    
    mockRequire.stop('./query');
    mockRequire.stop('@cloudcmd/create-element');
    
    el.hidden = true;
    
    t.notOk(body.removeEventListener.called, 'should not call body.removeListener');
    t.end();
}));

test('parse-images: onload: parent', (t) => {
    const afterShow = sinon.stub();
    const parent = {};
    
    const f = _onload(parent, afterShow);
    
    f();
    
    t.notOk(parent.hidden, 'should not be hidden');
    t.end();
});

test('parse-images: onload: afterShow', (t) => {
    const afterShow = sinon.stub();
    const parent = {};
    
    const f = _onload(parent, afterShow);
    
    f();
    
    t.ok(afterShow.calledWith(), 'should call afterShow');
    t.end();
});

