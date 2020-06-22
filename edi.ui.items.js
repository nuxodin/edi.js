/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */

import * as rte from './x/rte.js';

import './plugins/show/table/index.js';
import './plugins/show/shy/index.js';
import './plugins/show/br/index.js';
import './plugins/show/imageResize/index.js';

import './plugins/menu/code/index.js';
import './plugins/menu/styles/index.js';
import './plugins/menu/clean/index.js';
import './plugins/menu/bold/index.js';
import './plugins/menu/italic/index.js';
import './plugins/menu/unorderedList/index.js';
import './plugins/menu/orderedList/index.js';
import './plugins/menu/headings/index.js';
import './plugins/menu/insertTable/index.js';


edi.ui.setItem('Underline', 			{cmd:'underline',	shortcut:'u', enable:':not(img)'});
edi.ui.setItem('Undo', 					{cmd:'undo',	check:false});
edi.ui.setItem('Redo', 					{cmd:'redo',	check:false});
edi.ui.setItem('Unlink', 				{cmd:'unlink',	check:false});
edi.ui.setItem('Hr', 					{cmd:'inserthorizontalrule', check:false, enable(){ return !rte.isBlockLess(edi.active); } });
edi.ui.setItem('Strikethrough', 		{cmd:'strikethrough', xenable:':not(img)'});

/* bred-crumb *
let list = $('<div style="padding:2px; margin:2px; color:#000; background:linear-gradient(#fff,#ccc); xborder-radius:3px; box-shadow: 0 0 1px #000;">');
edi.ui.setItem( 'Tree', {
	el:list[0],
	//enable(el) {  },
	check(el) {
		list.html('');
		if (el===edi.active) return;
		$(el).parentsUntil(edi.active).addBack().each(function(i,el) {
			let btn = $('<span style="border-right:1px solid #bbb; padding:1px 3px; cursor:pointer">'+el.tagName+'</span>')
			.on({
				click() {
					Range.fromSelection().toContents().select();
					edi.checkSelection();
				},
				mouseover(e) {
					$('.tmp-rgRteMarked').removeClass('tmp-rgRteMarked');
					$(el).addClass('tmp-rgRteMarked');
					e.stopPropagation();
				}
			});
			list.append(btn);
		});
	}
});






/* delete Element */
edi.ui.setItem('Del',{
	click(el) { edi.element.removeNode(); },
	el: c1.dom.fragment('<a style="color:red">Element löschen</a>').firstChild
});
/* Target */
edi.ui.setItem('LinkTarget', {
	enable:'a, a > *',
	check(el) {
		el = el.closest('a');
		let target = el.getAttribute('target');
		return target && target !== '_self';
	},
	click(){
		let el = edi.element.closest('a');
		let active = this.el.classList.contains('active');
		el.setAttribute('target', active?'_self':'_blank');
		edi.trigger('input');
		edi.active.focus();
		//edi.trigger('elementchange');
	},
	el: c1.dom.fragment('<div class="-item -button">Link in neuem Fenster</div>').firstChild
});
/* Titletag *
{
	let el = c1.dom.fragment('<table style="clear:both"><tr><td style="width:84px">Titel<td><input>').firstChild;
	let inp = el.c1Find('input');
	inp.addEventListener('keyup', function() {
		edi.element.setAttribute('title',inp.value);
		!inp.value && edi.element.removeAttribute('title');
		edi.trigger('input');
	});
	edi.ui.setItem('AttributeTitle',{
		check(el) {
			inp.value = el ? el.getAttribute('title') : '';
		},
		el: el
	});
}
/* Image Attributes */ {
	let inp = c1.dom.fragment(
		'<table>'+
			'<tr><td style="width:84px">Breite:<td><input class=-x>'+
			'<tr><td>Höhe:<td><input class=-y>'+
			'<tr><td title="Alternativer Text">Alt-Text:<td><input class=-alt>'+
		'</table>').firstChild;
	inp.addEventListener('keyup',e=>{
		let img = edi.element;
		img.style.width  = inp.c1Find('.-x').value+'px';
		img.style.height = inp.c1Find('.-y').value+'px';
		img.setAttribute('alt', inp.c1Find('.-alt').value);
		if (e.target.classList.contains('-x') || e.target.classList.contains('-y')) {
			edi.element.dispatchEvent(new Event('qgResize',{bubbles:true}));
		}
		edi.active.dispatchEvent(new Event('input',{'bubbles':true,'cancelable':true})); // used!
		edi.trigger('input'); // used?
	})
	edi.ui.setItem('ImageDimension', {
		check(el) {
			inp.c1Find('.-x').value = el.offsetWidth;
			inp.c1Find('.-y').value = el.offsetHeight;
			inp.c1Find('.-alt').value = el.getAttribute('alt');
		},
		el:inp,
		enable:'img'
	});
}


var imgSizeCache = {};
function ImageRealSize(url, cb) {
	if (!imgSizeCache[url]) {
		var nImg = new Image();
		nImg.src = url;
		nImg.onload = function() {
			cb.apply(null, imgSizeCache[url] = [nImg.width, nImg.height]);
		};
	} else {
		cb.apply(null,imgSizeCache[url]);
	}
}


/* original image */
edi.ui.setItem('ImgOriginal', {
	enable: 'img',
	click(e) {
		let img = edi.element;
		let url = img.getAttribute('src').replace(/\/(w|h|zoom|vpos|hpos|dpr)-[^\/]+/g,'');
		ImageRealSize(url, function(w,h) {
			w /= 2; h /= 2; // vorgängig wird dem Server per Cookie mitteilt, dass er er die doppelte Auflösung ausliefern soll
			make(w,h);
		});
		function make(w,h) { // todo: c1-ratio
			img.setAttribute('src',url);
			img.setAttribute('width',w);
			img.setAttribute('height',h);
			img.style.width  = w+'px';
			img.style.height = h+'px';
			edi.element.dispatchEvent(new Event('qgResize',{bubbles:true})); // new
			edi.trigger('input');
			//edi.trigger('elementchange');
		}
	},
	el: c1.dom.fragment('<span class="-item -button" title="Originalgrösse">Originalbild</span>').firstChild
});
