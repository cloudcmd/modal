'use strict';

const sinon = require('sinon');
const currify = require('currify');

const {document} = global;

module.exports.create = create;

function create() {
    return {
        dataset: {},
        appendChild: sinon.stub(),
        removeChild: sinon.stub(),
        addEventListener: sinon.stub(),
        removeEventListener: sinon.stub(),
    };
};

module.exports.setGlobals = setGlobals;

function setGlobals() {
    const document = {
        querySelector: sinon.stub(),
        body: create(),
        createElement: sinon
            .stub()
            .returns(create()),
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

