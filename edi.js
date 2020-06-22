/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */
import {EdiUi} from './edi.ui.js';
import { Range } from './x/Range.js';

export class Edi {
	range = {};

	constructor(root){

		root.addEventListener('focus',e=>{
	        if (this.active === e.target) return; // not changed (focus was on UI-element)
	        if (!this.isTarget(e.target)) return;
			this.active = e.target;
			e.target.dispatchEvent(new CustomEvent('edi-activate', {bubbles:true}));
		},true);

		root.addEventListener('blur',e=>{
	        if (!this.isTarget(e.target)) return;
			if (this.dontTriggerBlur) return; // focus on UI-element
	        if (!this.active) {
				console.warn('blur but not active???')
				return;
			}
			e.target.dispatchEvent(new CustomEvent('edi-deactivate', {bubbles:true}));
			this.active = false;
		},true);

		root.addEventListener('c1-selectionchange-target', e=>{
			if (!this.isTarget(e.target)) return;
			if (!this.active) return;
			this.checkSelection();
			 // zB. qgSelection.rect triggers again, recursive
			 e.target.dispatchEvent(new CustomEvent('edi-selectionchange', {bubbles:true}));
		}, true)

		root.addEventListener('input',e=>{
			if (!this.isTarget(e.target)) return;
			//if (!this.active) return;
			e.target.dispatchEvent(new CustomEvent('edi-input', {bubbles:true}));
		},true);

		/*
		// esc to blur
		root.addEventListener('keyup',e=>{
	        if (!this.isTarget(e.target)) return;
			if (e.which === 27) { // needed?
				document.body.focus();
				document.activeElement.blur();
				getSelection().removeAllRanges();
				return;
			}
		},true);
		root.addEventListener('beforeunload',()=>{ // blur before unload (save), needed?
			this.active && this.active.blur();
		},true);
		*/

	}
	checkSelection() {
		var range = Range.fromSelection();
		this.range = range.oR;
		let newElement = range.exactElement() || range.commonElement;
		if (newElement === this.active) newElement = false;
		this.element = newElement;
	}
	manipulate(fn) {
		setTimeout(()=>{
			new Range(this.range).select();
			fn();
			// selection gets lost:
			//this.active.dispatchEvent(new CustomEvent('edi-input', {bubbles:true}));
			this.active.focus(); // firefox
		}, 80);
	}
	/*
	modifySelection(fn) {
		var els = [this.element];
		if (!this.range.collapsed) {
			console.log(this.range)
			if (rangeIsElement(this.range)) {
				els = [this.range.commonAncestorContainer];
			} else {
				els = rangeGetElements(this.range);
			}
		} else if (els[0] === this.active) {
			rangeExpandToElements(this.range);
			el = document.createElement('span');
			this.range.surroundContents(el);
			this.range.selectNodeContents(el);
		}
		fn(els);

		this.trigger('input');

		setTimeout(function() {
			var s = getSelection();
			s.c1SetRange(this.range);
			this.checkSelection();
		},90);
	}
	*/
	addUiElement(el) { // really needed?
		const activate = e => {
			this.dontTriggerBlur = true;
			const gMousedown = e=>{
				if (el.contains(e.target)) return;
				document.removeEventListener('mousedown',gMousedown);
				this.dontTriggerBlur = false;
				if (!this.active) return;
				if (this.active.contains(e.target)) return;
				this.active.dispatchEvent(new CustomEvent('edi-deactivate', {bubbles:true}));
	            this.active = false;
			};
			document.addEventListener('mousedown',gMousedown);
			e.stopPropagation();
		};
		el.addEventListener('mousedown', activate);
		el.addEventListener('mousedown',  e=>e.stopPropagation());
		el.addEventListener('touchstart', e=>e.stopPropagation());

	}
	isTarget(el) {
		if (!el.isContentEditable) return;
		//if ('form' in el) return; // needed?
		var style = getComputedStyle(el);
		var cpEdi = style.getPropertyValue('--edi'); // todo? cache cp-value or is it fast enough?

		if (!cpEdi) return;
		return true;
	}
};


window.edi = new Edi(window);
window.edi.ui = new EdiUi(edi);
