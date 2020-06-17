/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */

const blocklessElements = {
    'P':1,
    'H1':1,
    'H2':1,
    'H3':1,
    'H4':1,
    'H5':1,
    'H6':1,
    'SPAN':1,
    'BUTTON':1,
    'B':1,
    'I':1,
    'STRONG':1,
    'LABEL':1,
    'A':1,
};
const blockLikeElements = {
    'DIV':1,
    'TABLE':1,
    'TR':1,
    'TD':1,
    'UL':1,
    'LI':1,
    'OL':1,
    'P':1,
    'H1':1,
    'H2':1,
    'H3':1,
    'H4':1,
    'H5':1,
    'H6':1,
};


export function isBlockLess(el){
    return blocklessElements[el.tagName];
}

function isBlockLike(el){
    return blockLikeElements[el.tagName];
}


/**
 * makes a Range containing inline elements to cover all contained texts
 * @param {DomRange} range
 */
export function *rangeToInlineElements(range){
    const nodes = Array.from(rangeWalker(range));
    //for (node of rangeWalker(range)) {
    for (let node of nodes) {
        if (isBlockLike(node)) continue;
        if (node.nodeType === 3) {
            if (node.parentNode.tagName === 'TR') continue;
            const span = document.createElement('span');
            node.after(span);
            span.append(node);
            yield span;
        } else {
            yield node;
        }
    }
}


/**
 * split and walk all nodes contained in the range
 * @param {DomRange} range
 */
export function *rangeWalker(range){
    let [next, end] = rangeSplitTexts(range);
    while (next) {
        if (!next.contains(end)) yield next;  // its a parent containing the end node
        if (next === end) break; // finito
        next = next.firstChild || closestNextSibling(next);
    }
    yield end;
}

/**
 * splits start and end nodes of a DomRange
 * @param {DomRange} range
 * @returns [start, end]
 */
function rangeSplitTexts(range){
    range.commonAncestorContainer.normalize();
    var newStart = range.startContainer.splitText(range.startOffset)
    range.setStart(newStart, 0);
    range.endContainer.splitText(range.endOffset);
    return [
        range.startContainer,
        range.endContainer
    ];
}

function closestNextSibling(node) {
    while (node) {
        if (node.nextSibling) return node.nextSibling;
        node = node.parentNode;
    }
}


/*
export function isRoot(el) {
    return !el.parentNode || !el.parentNode.isContentEditable;
}
*/