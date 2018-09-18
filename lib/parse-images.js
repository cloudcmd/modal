'use strict';

const wraptile = require('wraptile/legacy');
const store = require('fullstore/legacy');
const createElement = require('@cloudcmd/create-element');

const showTitle = require('./show-title');
const query = require('./query');

const indexStore = store();
const helpersStore = store();

const next = wraptile((img, images) => setImage(indexStore() + 1, img, images));
const prev = wraptile((img, images) => setImage(indexStore() - 1, img, images))

const onload = wraptile((parent, afterShow) => {
    parent.hidden = false;
    afterShow();
});

const onKeydown = (img, images) => {
    return function keydownListener(e) {
        let i = indexStore();
        
        const ArrowLeft = 37;
        const ArrowRight = 39;
        const Esc = 27;
        
        const {keyCode} = e;
        
        if (keyCode === ArrowLeft)
            --i;
        else if (keyCode === ArrowRight)
            ++i;
        else if (keyCode === Esc)
            return document.body.removeEventListener('keydown', keydownListener);
        else
            return;
        
        setImage(i, img, images);
    };
};

function setImage(i, img, images) {
    const n = images.length - 1;
    
    if (i < 0 || i > n)
        return;
    
    indexStore(i);
    
    query('nav-left').hidden = !i;
    query('nav-right').hidden = i === n;
    
    const {
        href,
        title,
    } = images[i];
    
    img.src = href
    img.title = title;
    img.href = title;
    img.alt = title;
    
    if (helpersStore().title)
        showTitle(title, query('child'));
}

module.exports = parseImages;

function parseImages(parent, images, {afterShow, helpers, index}) {
    indexStore(index);
    helpersStore(helpers);
    
    const img = createImage();
    parent.appendChild(img);
    
    parent.hidden = true;
    
    parent.appendChild(createElement('div', {
        className: 'modal-nav modal-nav-left',
        dataName: 'modal-nav-left',
        innerHTML: '<span></span>',
    }));
    
    parent.appendChild(createElement('div', {
        className: 'modal-nav modal-nav-right',
        dataName: 'modal-nav-right',
        innerHTML: '<span data-name="modal-next"></span>',
    }));
    
    setImage(index, img, images);
    addListenerOnce(img, 'load', onload(parent, afterShow));
    
    query('nav-left')
        .addEventListener('click', prev(img, images));
    
    query('nav-right')
        .addEventListener('click', next(img, images));
    
    document.body.addEventListener('keydown', onKeydown(img, images));
}

function createImage() {
    const el = document.createElement('img');
    
    el.className = 'modal-image';
    
    return el;
}

module.exports._rmListener = rmListener;
function rmListener(el, name, fn) {
    return function f(e) {
        fn(e);
        el.removeEventListener(name, f);
    };
}

module.exports._addListenerOnce = addListenerOnce;
function addListenerOnce(el, name, fn) {
    el.addEventListener(name, rmListener(el, name, fn));
}

module.exports._onKeydown = onKeydown;
module.exports._indexStore = indexStore;
module.exports._helpersStore = helpersStore;
module.exports._onload = onload;

