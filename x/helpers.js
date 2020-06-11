/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */


/*

window.rangeExpandToStart = function(range) {
	var node = range.startContainer;
	while (node.previousSibling && node.previousSibling.data) {
		node = node.previousSibling;
	}
	//range.setStart(node,0);
	range.setEndBefore(node);
};
window.rangeExpandToEnd = function(range) {
	var node = range.endContainer;
	while (node.nextSibling && node.nextSibling.data) {
		node = node.nextSibling;
	}
	//range.setEnd(node,node.data.length);
	range.setEndAfter(node);
};
window.rangeExpandToElements = function(range) {
	rangeExpandToStart(range);
	rangeExpandToEnd(range);
};
window.rangeIsElement = function(range) {
	return range.toString() === range.commonAncestorContainer.textContent;
};
window.rangeGetNodes = function(r) {
	var start = r.startContainer;
	var end = r.endContainer;
	if (start === end) {
		var node = r.extractContents().firstChild;
		r.insertNode(node);
		return [node];
	}
	var els = [];

	walk(start);

	var sRange = document.createRange();
	sRange.setStart(r.startContainer,r.startOffset);
	sRange.setEndAfter(r.startContainer);
	var node = sRange.extractContents().firstChild;
	if (node.data) {
		sRange.insertNode(node);
		els.push(node);
	}
	sRange = document.createRange();
	sRange.setEnd(r.endContainer,r.endOffset);
	sRange.setStartBefore(r.endContainer);
	var node = sRange.extractContents().firstChild;
	if (node.data) {
		sRange.insertNode(node);
		els.push(node);
	}
	return els;

	function walk(el) {
		if (el !== end && !$.contains(el,end)) {
			el !== start && els.push(el);
			if (el.nextSibling) {
				walk(el.nextSibling);
			} else { // walk next parant with a nextSibling
				var parent = el.parentNode;
				while (parent && !parent.nextSibling) {
					parent = parent.parentNode;
				}
				walk(parent.nextSibling);
			}
		} else {
			el.firstChild && walk(el.firstChild);
		}
	}
};
window.rangeGetElements = function(r) {
	els = rangeGetNodes(r);
	for (var i = els.length, el; el = els[--i];) {
		if (el.data && el.data.toString().trim()) {
			var span = document.createElement('span');
			el.parentNode.insertBefore(span, el);
			span.appendChild(el);
			els[i] = span;
		}
	}
	return els;
};
*/
