'use strict';

const store = require('fullstore');
const currify = require('currify');
const createElement = require('@cloudcmd/create-element');

require('../css/modal.css');
const parseImages = require('./parse-images');
const showTitle = require('./show-title');
const query = require('./query');
const getClassName = require('./get-class-name');

const noop = () => {};

const optionsStore = store({});

const html = `
    <div class="modal-child" data-name="modal-child">
        <div class="modal-close" data-name="modal-close"></div>
    </div>
`;

const addEvent = currify((el, fn, name) => query(el).addEventListener(name, fn));
const addAllEvents = (el, fn, names) => names.map(addEvent(el, fn));

const {isArray} = Array;

module.exports.open = (inner, options = {}) => {
    check(inner);
    
    if (query('main'))
        return;
    
    const {
        beforeShow = noop,
        beforeClose = noop,
        afterShow = noop,
        afterClose = noop,
        onOverlayClick = noop,
        autoSize = false,
        index = 0,
        helpers = {},
        title = '',
    } = options;
    
    optionsStore({
        beforeClose,
        afterClose,
    });
    
    beforeShow();
    
    const isImage = isArray(inner);
    const isTitle = helpers.title && title || isImage;
    
    const className = getClassName({autoSize, isTitle});
    
    const el = createElement('div', {
        innerHTML: html,
        className,
        dataName: 'modal-main',
    });
    
    addAllEvents('main', onMainClick(onOverlayClick), [
        'click',
        'contextmenu',
    ]);
    
    query('close').addEventListener('click', close);
    
    const child = query('child');
    
    if (isImage)
        return parseImages(child, inner, {
            index,
            afterShow,
            helpers,
        });
    
    child.appendChild(inner);
    
    if (isTitle)
        showTitle(title, child);
    
    afterShow();
    
    return el;
};

const onMainClick = currify((overlayClick, event) => {
    if (event.target !== query('main'))
        return;
    
    close();
    overlayClick(event);
});

const close = () => {
    const el = query('main');
    
    const {
        beforeClose = noop,
        afterClose = noop,
    } = optionsStore();
    
    if (!el)
        return;
    
    beforeClose();
    
    document.body.removeChild(el);
    
    afterClose();
};

module.exports.close = close;

module.exports._optionsStore = optionsStore;
module.exports._onMainClick = onMainClick;

function check(inner) {
    if (!inner)
        throw Error('inner should be DOM-element!');
}

