/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */
// firefox resize images: enableObjectResizing
window.qgQueryCommandState = function(cmd) {
	try{
		return document.queryCommandState(cmd);
	} catch(e) { /*zzz*/ }
};
window.qgQueryCommandValue = function(cmd) {
	try{
		return document.queryCommandValue(cmd);
	} catch(e) { /*zzz*/ }
};
window.qgExecCommand = function(com,x,val) {
	let _ = qgExecCommand;
	if (!_.cmdUsed) {
		try {
			document.execCommand("styleWithCSS", false, false);
		} catch (e) {}
		_.cmdUsed = true;
	}
	switch (com) {
		case 'formatblock':
			document.execCommand(com,x,'<'+val+'>');
			document.execCommand(com,x,val);
			break;
		default:
			try {
				document.execCommand(com,x,val);
			} catch(e) {}
	}
};

Selection.prototype.c1GetRange = function() {
	return this.rangeCount ? this.getRangeAt(0) : null;
};
Selection.prototype.c1SetRange = function(range) {
	this.removeAllRanges();
	this.addRange(range);
};
/*
Selection.prototype.c1AnchorElement = function() {
	const node = this.anchorNode;
	return node.nodeType === 1 ? node : node.parentNode;
};
Selection.prototype.c1FocusElement = function() {
	const node = this.focusNode;
	return node.nodeType === 1 ? node : node.parentNode;
};
Range.prototype.c1Insert = function(node) {
	if (node instanceof Array) {
		for (let n of node) this.insertNode(n);
		//for (var i=0, n ; n = node[i++];) this.insertNode(n);
		return;
	}
	if (typeof node === 'string') node = document.createTextNode(node);
	this.insertNode(node);
};
*/

window.qgSelection = {
	element() {
		let el;
		if (!getSelection().rangeCount) return;
		let r = getSelection().getRangeAt(0);
		if (!r.collapsed && r.startContainer.childNodes.length) { // images
			el = r.startContainer.childNodes[r.startOffset];
		} else {
			el = r.commonAncestorContainer;
		}
		while (el.nodeType === 3) el = el.parentNode;
		return el;
	},
	text() {
		return getSelection().c1GetRange().toString();
	},
	isElement() {
		let el = this.element();
		let text = el.textContent || el.innerText || '';
		return text === this.text();
	},
	toElement(el) {
		let r = document.createRange();
		r.selectNode(el);
		getSelection().c1SetRange(r);
	},
	toChildren(el) {
		let r = document.createRange();
		r.selectNodeContents(el);
		getSelection().c1SetRange(r);
	},
	surroundContents(el) {
		let range = getSelection().c1GetRange();
		range.surroundContents(el);
		qgSelection.toChildren(el);
		return el;
	},
	collapse(where) {
		try { // firefox has an error
			where === 'start' ? getSelection().collapseToStart() : getSelection().collapseToEnd();
		} catch(e) {}
	},
	rect() {
		let r = getSelection().c1GetRange();
		let pos = r.getBoundingClientRect();
		if (r.collapsed && pos.top===0 && pos.left ===0) { // bug in chrome, webkit
			let tmpNode = document.createTextNode('\ufeff');
			r.insertNode(tmpNode);
			pos = r.getBoundingClientRect();
			r.setStartAfter(tmpNode);
			tmpNode.remove();
		}
		return pos;
	}
};

// if contenteditable inside a link
document.addEventListener('click', e=>{
	if (e.button !== 0) return;
	e.target.isContentEditable && e.preventDefault();
	const target = e.explicitOriginalTarget;
	target && target.isContentEditable && e.preventDefault(); // keyboard click firefox
});

// prevent (Firefox) placing cursor incorrectly
document.addEventListener('mousedown', e=>{
	if (!e.target.isContentEditable) return;
	var link = e.target.closest('a');
	if (!link) return;
	const href = link.getAttribute('href')
	link.removeAttribute('href');
	setTimeout(()=>link.setAttribute('href', href))
});

// firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1636516 // zzz fixed in 78
((d,e)=>{
  e = d.createElement('style');
  e.innerHTML = '[contenteditable=""],[contenteditable="true"]{-moz-user-modify:read-write}';
  d.head.appendChild(e);
})(document)


// img selectable (webkit,blink)
document.addEventListener('mousedown', e=>{
	if (e.button !== 0) return;
	if (!e.target.isContentEditable) return;
	if (e.target.tagName !== 'IMG') return;
	qgSelection.toElement(e.target);
}, true); // capture => if inside stoppropagation




/* contenteditable focus bug */
if (/AppleWebKit\/([\d.]+)/.exec(navigator.userAgent) && document.caretRangeFromPoint) {
    document.addEventListener('DOMContentLoaded', ()=>{
        let fixEl = document.createElement('input');
        fixEl.style.cssText = 'width:1px;height:1px;border:none;margin:0;padding:0; position:fixed; top:0; left:0';
        fixEl.tabIndex = -1;
        let shouldNotFocus = null;
        function fixSelection(){
            document.body.appendChild(fixEl);
            fixEl.focus();
            fixEl.setSelectionRange(0,0);
            setTimeout(function(){
                document.body.removeChild(fixEl);
            },100)
        }
        function checkMouseEvent(e){
            if (e.target.isContentEditable) return;
            let range = document.caretRangeFromPoint(e.clientX, e.clientY);
			if (!range) return;
            let wouldFocus = getContentEditableRoot(range.commonAncestorContainer);
            if (!wouldFocus || wouldFocus.contains(e.target)) return;
            shouldNotFocus = wouldFocus;
            setTimeout(()=>{
                shouldNotFocus = null;
            });
            if (e.type === 'mousedown') {
                document.addEventListener('mousemove', checkMouseEvent, false);
            }
        }
        document.addEventListener('mousedown', checkMouseEvent, false);
        document.addEventListener('mouseup', ()=>{
                document.removeEventListener('mousemove', checkMouseEvent, false);
        }, false);
        document.addEventListener('focus', e=>{
            if (e.target !== shouldNotFocus) return;
            if (!e.target.isContentEditable) return;
            fixSelection();
        }, true);
        document.addEventListener('blur', e=>{
			if (e.target !== shouldNotFocus) return;
        	if (!e.target.isContentEditable) return;
        	setTimeout(()=>{
        		if (document.activeElement === e.target) return;
        		if (!e.target.contains(getSelection().baseNode)) return;
                fixSelection();
        	})
	    }, true);
    });
}

function getContentEditableRoot(el) {
    if (el.nodeType === 3) el = el.parentNode;
    if (!el.isContentEditable) return false;
    while (el) {
        let next = el.parentNode;
        if (next.isContentEditable) {
            el = next;
            continue
        }
        return el;
    }
}

// firefox always inserts a br-tag at the end, todo: no final solution
document.addEventListener('input',e=>{
	if (!e.target.isContentEditable) return;
	var last = e.target.lastChild;
	if (!last || last.tagName !== 'BR') return;
	last.after(' ');
	last.remove();
	if (e.target.lastChild == e.target.firstChild) {
		e.target.lastChild.remove();
	}
});
