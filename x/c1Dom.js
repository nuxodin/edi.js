/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */
!function() { 'use strict';
if (c1.dom) return; // zzz if its a module

var w = window,
	d = document,
	elProto = Element.prototype;

c1.dom = {};
c1.dom.fragment = function(html){
	var hasSvg = html.includes('<svg');
	var tmpl = d.createElement(hasSvg?'div':'template');
	tmpl.innerHTML = html;
	if (tmpl.content === void 0) { // ie11 or width svg content (chrome bug)
		var fragment = d.createDocumentFragment();
		var isTableEl = /^[^\S]*?<(t(?:head|body|foot|r|d|h))/i.test(html);
		tmpl.innerHTML = isTableEl ? '<table>'+html : html;
		var els        = isTableEl ? tmpl.querySelector(RegExp.$1).parentNode.childNodes : tmpl.childNodes;
		while(els[0]) fragment.appendChild(els[0]);
		return fragment;
	}
	return tmpl.content;
};

d.cookie = "q1_dpr=" + devicePixelRatio + "; path=/";

/* custom el properties */
var poly = {
	c1Id: function() {
		return this.getAttribute('id') || (this.id = 'c1-gen-'+(autoId++));
	},
	c1FindAll: function(selector){
		var elements = this.querySelectorAll('#'+this.c1Id()+' '+selector);
		return Array.from(elements);
	},
	c1Find: function(selector){
		return this.querySelector('#'+this.c1Id()+' '+selector);
	},
	replace: function replace() {
		console.warn('deprecated, use replaceWidth');
		return this.replaceWith.apply(this, arguments);
	},
	/* (non standard) only ie supports native */
	removeNode: function(children) {
		if (children) return this.remove();
        var fragment = d.createDocumentFragment();
        while (this.firstChild) fragment.appendChild(this.firstChild);
        this.parentNode.replaceChild(fragment, this);
	},
	/* (non standard) */
	c1ZTop: function() {
		if (!this.parentNode) return;
		var children = this.parentNode.children,
            i=children.length,
            maxZ=0,
            child,
            myZ=0;
        while (child=children[--i]) {
            var childZ = getComputedStyle(child).getPropertyValue('z-index') || 0;
			if (child.style.zIndex > childZ) childZ = child.style.zIndex; // neu 5.16, computed after paint => check for real
			if (childZ === 'auto') childZ = 0;
            if (child === this) myZ = childZ;
			else maxZ = Math.max(maxZ, childZ);
        }
		if (myZ <= maxZ) this.style.zIndex = maxZ+1;
	}
};
var autoId = 0;
c1.ext(poly, elProto, false, true);

// not standard
poly.closest = function(sel){ return this.parentNode.closest(sel); };
c1.ext(poly, Text.prototype, false, true);

c1.dom.ready = new Promise(function(res){document.addEventListener('DOMContentLoaded',res);});

// iterators
if (w.Symbol && Symbol.iterator) {  // no ie11 :(
	[HTMLCollection,NodeList,StyleSheetList,w.CSSRuleList].forEach(function(Interface){
		if (!Interface) return;
		var proto = Interface.prototype;
		if (proto[Symbol.iterator]) return;
		proto[Symbol.iterator] = Array.prototype[Symbol.iterator];
	});
}

}();
