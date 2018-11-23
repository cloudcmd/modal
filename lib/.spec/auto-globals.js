'use strict';

const stub = require('@cloudcmd/stub');
const currify = require('currify');

const saveProps = require('./save-props');

const unsetGlobals = saveProps(global, [
    'document',
    'FormData',
    'URLSearchParams',
    'fetch',
]);

function create() {
    return {
        dataset: {},
        appendChild: stub(),
        removeChild: stub(),
        addEventListener: stub(),
        removeEventListener: stub(),
    };
};

function setGlobals() {
    const document = {
        querySelector: stub(),
        body: create(),
        createElement: stub(create),
    };
    
    const fetch = getFetch();
    const FormData = getFormData()
    const URLSearchParams = getURLSearchParams();
    
    Object.assign(global, {
        document,
        fetch,
        FormData,
        URLSearchParams,
    });
    
    return {
        document,
        fetch,
        FormData,
        URLSearchParams,
    };
};

function getFormData() {
    const entries = stub()
        .returns([]);
    
    const FormData = stub()
        .returns({
            entries
        });
    
    const constructor = function(...args) {
        return FormData(...args);
    };
    
    return constructor;
}

function getFetch() {
    return stub();
}

function getURLSearchParams() {
    const append = stub();
    
    return stub()
        .returns({
            append,
        });
}

const autoGlobals = currify(async (f, t) => {
    await f(t, setGlobals());
    unsetGlobals();
});

const set = currify((wrapper, tape, str, promise) => {
    return tape(str, wrapper(promise));
});

function tapify(tape, f) {
    const fn = set(f, tape);
    fn.only = set(f, tape.only);
    
    return fn;
};

module.exports = (tape) => {
    return tapify(tape, autoGlobals);
};

module.exports.create = create;

