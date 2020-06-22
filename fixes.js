/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */

Selection.prototype.c1GetRange = function() {
	return this.rangeCount ? this.getRangeAt(0) : null;
};
Selection.prototype.c1SetRange = function(range) {
	this.removeAllRanges();
	this.addRange(range);
};

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
	collapse(where) {
		//try { // firefox has an error
			where === 'start' ? getSelection().collapseToStart() : getSelection().collapseToEnd();
		//} catch(e) {}
	},
	rect() {
		let r = getSelection().c1GetRange();
		let pos = r.getBoundingClientRect();
		if (r.collapsed && pos.top===0 && pos.left ===0) { // firefox 77 / chrome / webkit
			console.warn('position top:0 && left:0 !', r);
			let tmpNode = document.createTextNode('\ufeff');
			hideFromSelectionchange(()=>{
				r.insertNode(tmpNode);
				pos = r.getBoundingClientRect();
				//r.setStartAfter(tmpNode); // zzz?
				tmpNode.remove();
			})
		}
		return pos;
	}
};


// silent manipulation
let ignoreSelectionChange = false;
let timeout = null;
const hideFromSelectionchange = function(fn){
	ignoreSelectionChange = true;
	fn();
	clearTimeout(timeout);
	// needs timeout, cause manipulations trigger async selectionchange
	// bad its async, maybe some important event get lost...?
	// how long should i wait? // better requestAnimationFrame?
	timeout = setTimeout(()=>ignoreSelectionChange = false, 10);
}
document.addEventListener('selectionchange', e=>{
	ignoreSelectionChange && e.stopImmediatePropagation();
}, true);



// debug only: detect selection recursion // zzz?
if (1 /* debug */) {
	let count = 0;
	document.addEventListener('selectionchange', e=>{
		if (count++ > 10) {
			console.error('recursion detected!');
			e.stopImmediatePropagation();
		}
		setTimeout(e=>count--,50);
	}, true);
}


//let preventReqursion = false;
document.addEventListener('selectionchange', e=>{
	const target = document.activeElement;

	// c1-selectionchange-target triggers on activeElement
	target.dispatchEvent( new CustomEvent('c1-selectionchange-target', {bubbles:true}) );

	// c1-selectionchange-write that prevents recursion and triggers on activeElement
	hideFromSelectionchange(()=>{
		target.dispatchEvent( new CustomEvent('c1-selectionchange-write', {bubbles:true}) );
	})

	/*
	if (preventReqursion) return;
    preventReqursion = true;
    target.dispatchEvent( new CustomEvent('c1-selectionchange-write', {bubbles:true}) );
    setTimeout(e=>{ // better requestAnimationFrame?
        preventReqursion = false;
	}, 10); // how long?
	*/
}, true);


// if contenteditable inside a link: do not follow
document.addEventListener('click', e=>{
	if (e.button !== 0) return;
	e.target.isContentEditable && e.preventDefault();
	const target = e.explicitOriginalTarget;
	target && target.isContentEditable && e.preventDefault(); // keyboard click firefox
});

// prevent (Firefox) placing cursor incorrectly in links
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

	let r = document.createRange();
	r.selectNode(e.target);
	getSelection().c1SetRange(r);

}, true); // capture => if inside stoppropagation



/* contenteditable focus bug */
if (/AppleWebKit\/([\d.]+)/.exec(navigator.userAgent) && document.caretRangeFromPoint) { // chrome / webkit
    document.addEventListener('DOMContentLoaded', ()=>{
        let fixEl = document.createElement('input');
        fixEl.style.cssText = 'width:1px;height:1px;border:none;margin:0;padding:0; position:fixed; top:0; left:0';
		fixEl.tabIndex = -1;

		// new:
		addEventListener('focus',e=>e.target===fixEl && e.stopImmediatePropagation() ,true);
		addEventListener('blur',e=>e.target===fixEl && e.stopImmediatePropagation() ,true);
		document.addEventListener('selectionchange',e=> document.activeElement===fixEl && e.stopImmediatePropagation() ,true);

        let shouldNotFocus = null;
        function fixSelection(){
            document.body.appendChild(fixEl);
            fixEl.focus();
            fixEl.setSelectionRange(0,0);
            setTimeout(() => document.body.removeChild(fixEl) ,100);
        }
        function checkMouseEvent(e){
            if (e.target.isContentEditable) return;
            let range = document.caretRangeFromPoint(e.clientX, e.clientY);
			if (!range) return;
            let wouldFocus = ceRoot(range.commonAncestorContainer);
            if (!wouldFocus || wouldFocus.contains(e.target)) return;
            shouldNotFocus = wouldFocus;
            setTimeout(() => shouldNotFocus = null );
            if (e.type === 'mousedown') addEventListener('mousemove', checkMouseEvent);
        }
        addEventListener('mousedown', checkMouseEvent);
        addEventListener('mouseup', () => removeEventListener('mousemove', checkMouseEvent) );
        addEventListener('focus', e=>{
            if (e.target !== shouldNotFocus) return;
			if (!e.target.isContentEditable) return;
			e.stopImmediatePropagation(); // new
            fixSelection();
        }, true);
        addEventListener('blur', e=>{
			if (e.target !== shouldNotFocus) return;
        	if (!e.target.isContentEditable) return;
			e.stopImmediatePropagation(); // new
        	setTimeout(()=>{
        		if (document.activeElement === e.target) return;
        		if (!e.target.contains(getSelection().baseNode)) return;
                fixSelection();
        	})
	    }, true);
    });
}

function ceRoot(node) {
    if (node.nodeType === 3) node = node.parentNode;
    if (!node.isContentEditable) return false;
    while (node) {
        let next = node.parentNode;
        if (!next.isContentEditable) return node;
        node = next;
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

/* on contextmenu: prevent select */
document.addEventListener('mousedown',e=>{
	if (!e.target.isContentEditable) return;
	e.which === 3 && e.preventDefault();
});


//qgExecCommand('enableInlineTableEditing', false, false); // The handles are disabled by default since Firefox 64
//document.addEventListener('DOMContentLoaded',function(){
	//qgExecCommand('enableObjectResizing', false, false); // The handles are disabled by default since Firefox 64
//});
