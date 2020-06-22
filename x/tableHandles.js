/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */

import './c1Dom.js';

export class tableHandles {
	constructor(){

		// const remSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" stroke="#ee3c3c" stroke-width="14"><line x1="4" y1="4" x2="60" y2="60"/><line x1="4" y1="60" x2="60" y2="4"/></svg>';
		// const addSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" stroke="#444" stroke-width="14"><line x1="0" y1="32" x2="64" y2="32"/><line x1="32" y1="0" x2="32" y2="64"/></svg>';

		const remSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" stroke="#ee3c3c" stroke-width="14"><path d="M4 4l56 56M4 60L60 4"/></svg>';
		const addSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" stroke="#444" stroke-width="14"><path d="M0 32h64M32 0v64"/></svg>';

		var remImgData = '\'data:image/svg+xml;utf8,'+encodeURIComponent(remSvg)+'\'';
		var addImgData = '\'data:image/svg+xml;utf8,'+encodeURIComponent(addSvg)+'\'';
		this.root = c1.dom.fragment(
		'<div class="c1TableHandles q1Rst">'+
			'<a class=-rowRemove>'+
			// todo:	'<svg viewBox="0 0 64 64" stroke="#ee3c3c" stroke-width="14"><path d="M4 4l56 56M4 60L60 4"/></svg>'+
			'</a>'+
			'<a class=-rowAdd></a>'+
			'<a class=-colAdd></a>'+
			'<a class=-colRemove></a>'+
			'<style>'+
			'.c1TableHandles > a {'+
				'position: fixed; '+
				'border:1px solid #bbb; '+
				'border-radius: 50%; '+
				'background-color: #fff; '+
				'width: 20px; '+
				'height: 20px; '+
				'background-position: 50%; '+
				'background-size: 50%; '+
				'background-repeat: no-repeat; '+
				'color: #000; cursor:pointer; '+
				'background-image: url('+remImgData+'); '+
			'}'+
			'.c1TableHandles > a.-rowAdd, .c1TableHandles > a.-colAdd { '+
				'background-image: url('+addImgData+'); '+
			'}'+
			'</style>'+
		'</div>').firstChild;
		this.rowRemove = this.root.querySelector('.-rowRemove');
		this.rowAdd    = this.root.querySelector('.-rowAdd');
		this.colAdd    = this.root.querySelector('.-colAdd');
		this.colRemove = this.root.querySelector('.-colRemove');
		this.root.addEventListener('mousedown',e=>e.preventDefault());
	}
	showTd(td) {
		this.active = td;
		document.body.append(this.root);
		this.root.c1ZTop();
		this.positionize(td);
		clearInterval(this.checkIntr);
		this.checkIntr = setInterval(this.handleEvent.bind(this), 100);
		document.addEventListener('keydown', this);
	}
	hide() {
		this.root.remove();
	}
	positionize(td) {
		var tr = td.parentNode;
		if (!tr) return;
		var Cpos = td.getBoundingClientRect();
		var table = tr.closest('table');
		if (!table) return;
		var Tpos = table.getBoundingClientRect();
		this.rowRemove.style.cssText = 'top:'+(Cpos.top + (tr.offsetHeight / 2) - 11)+'px; left:'+(Tpos.left - 25)+'px;';
		this.rowAdd.style.cssText    = 'top:'+(Cpos.top + tr.offsetHeight - 4)+'px;        left:'+(Tpos.left - 25)+'px;';
		this.colRemove.style.cssText = 'top:'+(Tpos.top - 25)+'px;                         left:'+(Cpos.left + (td.offsetWidth / 2) - 8)+'px;';
		this.colAdd.style.cssText    = 'top:'+(Tpos.top - 25)+'px;                         left:'+(Cpos.left + td.offsetWidth - 2)+'px;';
	}
	handleEvent() {
		setTimeout(()=>{
			if (this.root.parentNode) {
				this.positionize(this.active);
			} else {
				clearInterval(this.checkIntr);
				document.removeEventListener('keydown', this);
			}
		});
	}
};
