export default ({autoSize, isTitle}) => {
    const classNames = ['modal-main'];
    
    if (autoSize)
        classNames.push('modal-autosize');
    
    if (isTitle)
        classNames.push('modal-is-title');
    
    return classNames.join(' ');
};
