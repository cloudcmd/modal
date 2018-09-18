'use strict';

const createElement = require('@cloudcmd/create-element');
const query = require('./query');

module.exports = (title, parent) => {
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

