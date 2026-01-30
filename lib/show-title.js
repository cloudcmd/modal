import _createElement from '@cloudcmd/create-element';
import _query from './query.js';

export default (title, parent, overrides = {}) => {
    const {
        query = _query,
        createElement = _createElement,
    } = overrides;
    
    const titleEl = query('title');
    
    if (titleEl) {
        query('title-text').textContent = title;
        return;
    }
    
    const el = createElement('div', {
        className: 'modal-title',
        dataName: 'modal-title',
        parent,
    });
    
    createElement('span', {
        parent: el,
        textContent: title,
        className: 'modal-title-text',
        dataName: 'modal-title-text',
    });
};
