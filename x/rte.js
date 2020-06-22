/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */
import {Range} from './Range.js';

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
const blockElements = {
    'DIV':1,
    'P':1,
    'H1':1,
    'H2':1,
    'H3':1,
    'H4':1,
    'H5':1,
    'H6':1,
}


// format block
export const block = {
    format(range, tag){
        var range = new Range(range);
        var saved = range.save();
        let node = closestInsideBlockRoot(range.commonNode);
        let siblings = nonBlockSiblings(node);
        if (isBlock(node.parentNode) && siblings.length === node.parentNode.childNodes.length) {
            elementChangeTag(node.parentNode, tag);
        } else {
            let newElement = document.createElement(tag);
            siblings[0].before(newElement);
            for (let sibling of siblings) {
                newElement.append(sibling);
            }
        }
        range.restore(saved)
    }
}
function closestInsideBlockRoot(node) {
    while (node) {
        let next = node.parentNode;
        if (isBlockLike(next)) return node;
        if (isRoot(next)) return node;
        node = next;
    }
}
function elementChangeTag(element, tag) {
    if (element.tagName === tag.toUpperCase()) return;
    const newElement = document.createElement(tag);
    for (let attr of element.attributes) {
        newElement.setAttribute(attr.name, attr.value);
    }
    while (element.firstChild) {
        newElement.append(element.firstChild);
    }
    element.after(newElement);
    element.remove();
    return element;
}
function nonBlockSiblings(node){
    let temp;
    while (1) { // go to first
        temp = node.previousSibling;
        if (!temp || isBlockLike(temp)) break;
        node = temp;
    }
    const nodes = [];
    while (1) {// finde Nodes
        nodes.push(node);
        temp = node.nextSibling;
        if (!temp || isBlockLike(temp)) break;
        node = temp;
    }
    return nodes;
}


function isBlock(el){
    return blockElements[el.tagName];
}

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
 * @example
 * Sample: splitParentStartgWith(textNodeTEXT, true);
 * <span>this is a |TEST<b>x</b></span> =>
 * <span>this </span><span>is a TEST<b>x</b></span>
 * @param {Node} node
 * @param {boolean} right
 */
export function splitParentStartingWith(node, left){
    const parent = node.parentNode;
    const clone = parent.cloneNode(false);
    do {
        let next = node[(left?'previous':'next')+'Sibling'];
        clone[left?'prepend':'append'](node);
        node = next;
    } while(node);
    parent[left?'before':'after'](clone);
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


export function isRoot(el) {
    return !el.parentNode || !el.parentNode.isContentEditable;
}

export function rootOf(node) {
    if (node.nodeType === 3) node = node.parentNode;
    if (!node.isContentEditable) return false;
    while (node) {
        let next = node.parentNode;
        if (!next.isContentEditable) return node;
        node = next;
    }
}






export function queryCommandState(cmd) { // qgQueryCommandState
	try{
		return document.queryCommandState(cmd);
	} catch(e) { /*zzz*/ }
};
export function queryCommandValue(cmd) { // qgQueryCommandValue
	try{
		return document.queryCommandValue(cmd);
	} catch(e) { /*zzz*/ }
};
export function execCommand(com,x,val) { // qgExecCommand
	let _ = execCommand;
	if (!_.cmdUsed) {
		try {
			document.execCommand("styleWithCSS", false, false);
		} catch (e) {}
		_.cmdUsed = true;
	}
	switch (com) {
		case 'formatblock':
			document.execCommand(com,x,val);
			break;
		default:
			try {
				document.execCommand(com,x,val);
			} catch(e) {}
	}
};



/*
export function combiningInlineChildren(parent){
    let node = parent.firstChild;
    do {
        let next = node.nextSibling;
        if (isSimiliarNode(node, next)){
            node.append()
        }
    }
}
function isSimiliarNode(n1, n2){
    if(n1.tagName !== n2.tagName) return;
    for (n1.attributes) {
        if (n1.getAttribute(attr) !== n2.getAttribute(attr)) return;
    }
    for (n2.attributes) {
        if (n1.getAttribute(attr) !== n2.getAttribute(attr)) return;
    }
}
*/



// fake Selection
/*
{
	let el = document.createElement('style')
	el.innerHTML = '.qgRte_fakeSelection {}';
	document.head.append(el);
	let style = el.sheet.cssRules[0].style;
	style.background = 'rgba(150,150,150,.9)';
	style.color = '#fff';
	edi.fakeSelection = {
		addClass   (el){ el.classList.add   ('qgRte_fakeSelection'); },
		removeClass(el){ el.classList.remove('qgRte_fakeSelection'); },
	}
}
*/