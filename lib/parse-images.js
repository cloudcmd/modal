import wraptile from 'wraptile';
import {fullstore} from 'fullstore';
import _createElement from '@cloudcmd/create-element';
import _showTitle from './show-title.js';
import _query from './query.js';

const indexStore = fullstore();
const helpersStore = fullstore();

const next = wraptile((img, images) => setImage(indexStore() + 1, img, images));
const prev = wraptile((img, images) => setImage(indexStore() - 1, img, images));

const onload = wraptile((parent, afterShow) => {
    parent.hidden = false;
    afterShow();
});

const onKeydown = (img, images, query) => function keydownListener(e) {
    let i = indexStore();
    
    const ArrowLeft = 37;
    const ArrowRight = 39;
    const Esc = 27;
    
    const {keyCode} = e;
    
    if (keyCode === ArrowLeft) {
        --i;
    } else if (keyCode === ArrowRight) {
        ++i;
    } else {
        if (keyCode === Esc)
            return document.body.removeEventListener('keydown', keydownListener);
        
        return;
    }
    
    setImage(i, img, images, {
        query,
    });
};

function setImage(i, img, images, {query, showTitle}) {
    const n = images.length - 1;
    
    if (i < 0 || i > n)
        return;
    
    indexStore(i);
    
    query('nav-left').hidden = !i;
    query('nav-right').hidden = i === n;
    
    const {href, title} = images[i];
    
    img.src = href;
    img.title = title;
    img.href = title;
    img.alt = title;
    
    if (helpersStore().title)
        showTitle(title, query('child'));
}

export default parseImages;

function parseImages(parent, images, overrides = {}) {
    const {
        afterShow,
        helpers,
        index,
        query = _query,
        createElement = _createElement,
        showTitle = _showTitle,
    } = overrides;
    
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
    
    setImage(index, img, images, {
        query,
        showTitle,
    });
    addListenerOnce(img, 'load', onload(parent, afterShow));
    
    query('nav-left').addEventListener('click', prev(img, images, query));
    
    query('nav-right').addEventListener('click', next(img, images, query));
    
    document.body.addEventListener('keydown', onKeydown(img, images, query));
}

function createImage() {
    const el = document.createElement('img');
    
    el.className = 'modal-image';
    
    return el;
}

export const _rmListener = rmListener;

function rmListener(el, name, fn) {
    return function f(e) {
        fn(e);
        el.removeEventListener(name, f);
    };
}

export const _addListenerOnce = addListenerOnce;

function addListenerOnce(el, name, fn) {
    el.addEventListener(name, rmListener(el, name, fn));
}

export const _onKeydown = onKeydown;
export const _indexStore = indexStore;
export const _helpersStore = helpersStore;
export const _onload = onload;
