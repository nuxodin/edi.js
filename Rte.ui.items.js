/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */

/*
let x = my.setItem('Bold',
	{
		shortcut:'l'
	}
);
x.addEventListener('mousedown', function() {
	Rte.modifySelection(function(els) {
		let first = $(els[1]||els[0]);
		let act = first.hasClass('SmallText') ? 'removeClass' : 'addClass';
		for (let i = els.length, el; el = els[--i];) {
			$(el)[act]('SmallText');
		}
	});
});
*/
import * as rte from './x/rte.js';



Rte.ui.setItem('Underline', 			{cmd:'underline',	shortcut:'u', xenable:':not(img)'});
Rte.ui.setItem('Undo', 					{cmd:'undo',	check:false});
Rte.ui.setItem('Redo', 					{cmd:'redo',	check:false});
Rte.ui.setItem('Unlink', 				{cmd:'unlink',	check:false});
Rte.ui.setItem('Hr', 					{cmd:'inserthorizontalrule', check:false, enable(){ return !rte.isBlockLess(Rte.active); } });
Rte.ui.setItem('Strikethrough', 		{cmd:'strikethrough', xenable:':not(img)'});

/* bred-crumb *
let list = $('<div style="padding:2px; margin:2px; color:#000; background:linear-gradient(#fff,#ccc); xborder-radius:3px; box-shadow: 0 0 1px #000;">');
Rte.ui.setItem( 'Tree', {
	el:list[0],
	//enable(el) {  },
	check(el) {
		list.html('');
		if (el===Rte.active) return;
		$(el).parentsUntil(Rte.active).addBack().each(function(i,el) {
			let btn = $('<span style="border-right:1px solid #bbb; padding:1px 3px; cursor:pointer">'+el.tagName+'</span>')
			.on({
				click() {
					qgSelection.toChildren(el);
					Rte.checkSelection();
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


/* show invisibles *
{
	function replaceContents(node){
		for (const el of node.childNodes) replaceNode(el);
	}
	function replaceNode(node) {
		if (node.nodeType === 3) { // text-nodes
			let offset = 0;
			for (const char of node.data) {
				if (char === '\xa0') {  // nbsp
					//var x = node.splitText(offset);
				}
				++offset;
			}
		} else {
			replaceContents(node);
		}
	}
	Rte.ui.setItem('ShowInvisibleChars', {
		click(e) {
			let root = Rte.active;
			replaceContents(root);
		}
		,shortcut:'space'
	});
}




/* insert table */
Rte.ui.setItem('Table', {
	click() {
		let table = c1.dom.fragment('<table><tr><td>&nbsp;<td>&nbsp;<tr><td>&nbsp;<td>&nbsp;</table>').firstChild;
		let r = getSelection().getRangeAt(0);
		r.deleteContents();
		r.insertNode(table);
		getSelection().collapse(table.c1Find('td'),0);
	},
	enable(){
		return !rte.isBlockLess(Rte.active);
	}
});
/* delete Element */
Rte.ui.setItem('Del',{
	click(el) { Rte.element.removeNode(); },
	el: c1.dom.fragment('<a style="color:red">Element löschen</a>').firstChild
});
/* Target */
Rte.ui.setItem('LinkTarget', {
	enable:'a, a > *',
	check(el) {
		el = el.closest('a');
		let target = el.getAttribute('target');
		return target && target !== '_self';
	},
	click(){
		let el = Rte.element.closest('a');
		let active = this.el.classList.contains('active');
		el.setAttribute('target', active?'_self':'_blank');
		Rte.trigger('input');
		Rte.active.focus();
		Rte.trigger('elementchange');
	},
	el: c1.dom.fragment('<div class="-item -button">Link in neuem Fenster</div>').firstChild
});
/* Titletag *
{
	let el = c1.dom.fragment('<table style="clear:both"><tr><td style="width:84px">Titel<td><input>').firstChild;
	let inp = el.c1Find('input');
	inp.addEventListener('keyup', function() {
		Rte.element.setAttribute('title',inp.value);
		!inp.value && Rte.element.removeAttribute('title');
		Rte.trigger('input');
	});
	Rte.ui.setItem('AttributeTitle',{
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
		let img = Rte.element;
		img.style.width  = inp.c1Find('.-x').value+'px';
		img.style.height = inp.c1Find('.-y').value+'px';
		img.setAttribute('alt', inp.c1Find('.-alt').value);
		if (e.target.classList.contains('-x') || e.target.classList.contains('-y')) {
			Rte.element.dispatchEvent(new Event('qgResize',{bubbles:true}));
		}
		Rte.active.dispatchEvent(new Event('input',{'bubbles':true,'cancelable':true})); // used!
		Rte.trigger('input'); // used?
	})
	Rte.ui.setItem('ImageDimension', {
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
Rte.ui.setItem('ImgOriginal', {
	enable: 'img',
	click(e) {
		let img = Rte.element;
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
			Rte.element.dispatchEvent(new Event('qgResize',{bubbles:true})); // new
			Rte.trigger('input');
			Rte.trigger('elementchange');
		}
	},
	el: c1.dom.fragment('<span class="-item -button" title="Originalgrösse">Originalbild</span>').firstChild
});



Rte.ui.config = {
	rteDef:{
		main:['LinkInput','Bold','Insertunorderedlist','Link','Removeformat','Format','Style'],
		more:['Italic','Insertorderedlist','Strikethrough','Underline','Hr','Code','Table','Shy',/*'ShowInvisibleChars',*/'LinkTarget','ImgOriginal','ImgOriginalRetina',/*'AttributeTitle',*/'ImageDimension','Tree']
	},
	rteMin:{
		main:['Bold','Insertunorderedlist','Link','Style']
	},
};
