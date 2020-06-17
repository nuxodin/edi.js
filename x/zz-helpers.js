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

*/
