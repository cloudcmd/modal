'use strict';

const stub = require('@cloudcmd/stub');
const currify = require('currify');

const {document} = global;

module.exports.create = create;

function create() {
    return {
        dataset: {},
        appendChild: stub(),
        removeChild: stub(),
        addEventListener: stub(),
        removeEventListener: stub(),
    };
};

module.exports.setGlobals = setGlobals;

function setGlobals() {
    const document = {
        querySelector: stub(),
        body: create(),
        createElement: stub(create),
    };
    
    global.document = document;
    
    return document;
};

module.exports.unsetGlobals = unsetGlobals;

function unsetGlobals() {
    global.document = document;
}

module.exports.autoGlobals = currify((f, t) => {
    f(t, setGlobals());
    unsetGlobals();
});

