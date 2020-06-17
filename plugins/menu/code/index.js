

import {indent} from './html-indent.js';

let wrapper = c1.dom.fragment(
	'<div id=qgRteHtml>'+
		'<textarea spellcheck=false class=c1Rst></textarea>'+
		'<style>'+
		'	#qgRteHtml { opacity:1; transform:opacity .5s; position:fixed; border:2px solid black; top:40%; left:1%; bottom:1%; right:1%; background:#fff; color:#000; margin:auto; box-shadow:0 0 20px} '+
		'	#qgRteHtml > textarea { position:absolute; top:0; left:0; right:0; bottom:0; width:100%; height:100%; font:11px monospace; } '+
		'	#qgRteHtml.-Invisible { opacity:.1; } '+
		'	#qgRteHtml:hover { opacity:1; } '+
		'</style>'+
	'</div>'
).firstChild;


let tO = null;
function makeInvisible(){
	clearTimeout(tO);
	wrapper.classList.remove('-Invisible');
	tO = setTimeout(()=>{
		wrapper.classList.add('-Invisible');
	},700)
}
wrapper.addEventListener('keydown', makeInvisible);
wrapper.addEventListener('mousemove', makeInvisible);

let html = wrapper.firstChild;
let el = Rte.ui.setItem('Code', {
	click() {
		let el = Rte.active;
		let sel = window.getSelection();
		let code;
		if (sel.rangeCount > 0) {
			let range = sel.getRangeAt(0);
			let startTextNode = document.createTextNode('marker_start_so9df8as0f0');
			let endTextNode   = document.createTextNode('marker_end_laseg08a0egga');
			let tmpRange = range.cloneRange();
			tmpRange.collapse(false);
			tmpRange.insertNode(endTextNode);
			tmpRange = range.cloneRange();
			tmpRange.collapse(true);
			tmpRange.insertNode(startTextNode);
			code = indent(el.innerHTML);

			startTextNode.remove();
			endTextNode.remove();

			let start = code.indexOf('marker_start_so9df8as0f0');
			code = code.replace('marker_start_so9df8as0f0','');
			let end = code.indexOf('marker_end_laseg08a0egga');
			code = code.replace('marker_end_laseg08a0egga','');

			let brsTotal = (code.match(/\n/g)||[]).length;
			let brs 	 = brsTotal && (code.substr(0,start).match(/\n/g)||[]).length;

			setTimeout(()=>{
				html.focus();

				let y = parseInt((html.scrollHeight / brsTotal)*brs - 250);
				brs && (html.scrollTop = y);

				html.setSelectionRange(start, end);
			},10);
		} else {
			code = indent(el.innerHTML);
		}
		html.value = code;
		html.onkeyup = html.onblur = function(){
			el.innerHTML = html.value.replace(/\s*\uFEFF\s*/g,'');
			el.dispatchEvent(new Event('input',{'bubbles':true,'cancelable':true}));
		}
		document.body.append(wrapper);
		wrapper.c1ZTop();

		function hide(e) {
			if (e.which===27 || e.target !== html) {
				wrapper.remove();
				document.removeEventListener('keydown',hide);
				document.removeEventListener('mousedown',hide);
				el.focus();
			}
		};
		setTimeout(()=>{
			document.addEventListener('keydown',hide);
			document.addEventListener('mousedown',hide);
		},3);
	},
	shortcut:'h'
});
el.classList.add('expert');