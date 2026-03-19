import '../css/modal.css';
import {fullstore} from 'fullstore';
import currify from 'currify';
import createElement from '@cloudcmd/create-element';
import _parseImages from './parse-images.js';
import _showTitle from './show-title.js';
import _query from './query.js';
import getClassName from './get-class-name.js';

const noop = () => {};

const optionsStore = fullstore({});

const innerHTML = `
    <div class="modal-child" data-name="modal-child">
        <div class="modal-close" data-name="modal-close"></div>
    </div>
`;

const addEvent = currify((el, fn, query, name) => query(el).addEventListener(name, fn));
const addAllEvents = (el, fn, query, names) => names.map(addEvent(el, fn, query));

const {isArray} = Array;

export const open = (inner, options = {}) => {
    check(inner);
    
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
        query = _query,
        showTitle = _showTitle,
        parseImages = _parseImages,
    } = options;
    
    if (query('main'))
        return;
    
    optionsStore({
        beforeClose,
        afterClose,
    });
    
    beforeShow();
    
    const isImage = isArray(inner);
    const isTitle = helpers.title && title || isImage;
    
    const className = getClassName({
        autoSize,
        isTitle,
    });
    
    const el = createElement('div', {
        innerHTML,
        className,
        dataName: 'modal-main',
    });
    
    addAllEvents('main', onMainClick(onOverlayClick), query, ['click', 'contextmenu']);
    
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

const onMainClick = (overlayClick, overrides = {}) => (event) => {
    const {query = _query} = overrides;
    
    if (event.target !== query('main'))
        return;
    
    close(event);
    overlayClick(event);
};

export const close = (event, overrides = {}) => {
    const {query = _query} = overrides;
    
    if (event)
        event.stopPropagation();
    
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

export const _optionsStore = optionsStore;
export const _onMainClick = onMainClick;

function check(inner) {
    if (!inner)
        throw Error('inner should be DOM-element!');
}
