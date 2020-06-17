/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */
import './x/c1.js';

window.Rte = {
	range : {},
	rangeStaticValues : {},
	checkSelection() {
		/*
		 * Problem:
		 * Es sollte auch nach neuem element geprüft werden wenn eltern elemente geändert werden
		 * jetzt ist es so, dass die Selection und das element gleich bleiben obwohl sich die dom struktur geänder hat.
		 *
		 * In webkit ist das Element dann z.T nicht mehr das selbe. dann gehts... (ul maker)
		 *  */
		const sel = getSelection();
		if (!sel.rangeCount) return;
		/* new selection? */
		const newRange = sel.getRangeAt(0).cloneRange(); // cloneRange() needed?
		/* use compareBoundaryPoints? (god example: http://help.dottoro.com/ljxgoxcb.php) */
		const same = newRange.startContainer === Rte.rangeStaticValues.startContainer
				&& newRange.startOffset === Rte.rangeStaticValues.startOffset
				&& newRange.endContainer === Rte.rangeStaticValues.endContainer
				&& newRange.endOffset === Rte.rangeStaticValues.endOffset;
		if (same) return;
		Rte.range = newRange;
		Rte.rangeStaticValues = c1.ext(newRange);

		/* new element? */
		let tmp = qgSelection.element(); // todo

		if (tmp.tagName !== 'IMG') {
			tmp = Rte.range.commonAncestorContainer.data !== undefined ? Rte.range.commonAncestorContainer.parentNode : Rte.range.commonAncestorContainer;
		}
		let newElement = tmp;
		if (newElement === Rte.active) newElement = false;
		if (Rte.element !== newElement) {
			Rte.element = newElement;
			Rte.trigger('elementchange');
		}
		Rte.trigger('selectionchange');
	},
	manipulate(fn) {
		setTimeout(function() {
			getSelection().c1SetRange(Rte.range);
			fn && fn();
			Rte.checkSelection();
	        Rte.trigger('input');
			Rte.active.focus(); // firefox
		}, 80);
	},
	/*
	modifySelection(fn) {
		var els = [Rte.element];
		if (!Rte.range.collapsed) {
			console.log(Rte.range)
			if (rangeIsElement(Rte.range)) {
				els = [Rte.range.commonAncestorContainer];
			} else {
				els = rangeGetElements(Rte.range);
			}
		} else if (els[0] === Rte.active) {
			rangeExpandToElements(Rte.range);
			el = document.createElement('span');
			Rte.range.surroundContents(el);
			Rte.range.selectNodeContents(el);
		}
		fn(els);

		Rte.trigger('input');

		setTimeout(function() {
			var s = getSelection();
			s.c1SetRange(Rte.range);
			Rte.checkSelection();
		},90);
	},
	*/
	addUiElement(el) { // really needed?
		const activate = function(e) {
			Rte.dontBlur = true;
			const gMousedown = function(e) {
				if (el.contains(e.target)) return;
				document.removeEventListener('mousedown',gMousedown);
				Rte.dontBlur = false;
				if (!Rte.active) return;
				if (Rte.active.contains(e.target)) return;
				Rte.trigger('deactivate');
	            Rte.active = false;
			};
			document.addEventListener('mousedown',gMousedown);
			e.stopPropagation();
		};
		el.addEventListener('mousedown',activate);
	},
	isTarget(el) {
		if (!el.isContentEditable) return;
		if ('form' in el) return; // needed?
		//if ({INPUT:1,TEXTAREA:1,SELECT:1}[el.tagName]) return;
		var style = getComputedStyle(el);
		var cpEdi = style.getPropertyValue('--edi'); // todo? cache cp-value or is it fast enough?
		if (!cpEdi) return;
		return true;
	},
	init() {
		const root = window;
		addEventListener('focus',e=>{
	        if (!Rte.isTarget(e.target)) return;
	        if (Rte.active === e.target) return;
			Rte.active = e.target;
			Rte.trigger('activate');
			Rte.checkSelection();
		},true);
		addEventListener('blur',e=>{
	        if (!Rte.isTarget(e.target)) return;
	        if (!Rte.dontBlur && Rte.active) {
	            Rte.trigger('deactivate');
	            Rte.active = false;
	        }
		},true);

		var preventSelectionChangeRecursion = false;
		addEventListener('selectionchange', e=>{
			if (!Rte.active) return;
			if (preventSelectionChangeRecursion) return;
			preventSelectionChangeRecursion = true;
	        Rte.checkSelection();
			preventSelectionChangeRecursion = false;
		}, true)

		addEventListener('keyup',e=>{ // use selectionchange?
	        if (!Rte.isTarget(e.target)) return;
			if (e.which === 27) { // needed?
				document.body.focus();
				document.activeElement.blur();
				getSelection().removeAllRanges();
				return;
			}
	        Rte.checkSelection();
		},true);
		/*
		addEventListener('mouseup',e=>{ // use selectionchange?
			if (!Rte.active) return; // new 15.7.17 // zzz, if used: "addEventListener('selectionchange',e=>{"
            if (!Rte.isTarget(e.target)) return;
	        Rte.checkSelection();
		},true);
		*/
		addEventListener('input',e=>{
			if (!Rte.active || !Rte.isTarget(e.target)) return;
	        Rte.trigger('input',e);
		},true);
		addEventListener('beforeunload',()=>{ // blur before unload (save), needed?
			Rte.active && Rte.active.blur();
		},true);
	}
};
c1.ext(c1.Eventer,Rte);


// fake Selection
{
	let el = document.createElement('style')
	el.innerHTML = '.qgRte_fakeSelection {}';
	document.head.append(el);
	let style = el.sheet.cssRules[0].style;
	style.background = 'rgba(150,150,150,.9)';
	style.color = '#fff';
	Rte.fakeSelection = {
		addClass   (el){ el.classList.add   ('qgRte_fakeSelection'); },
		removeClass(el){ el.classList.remove('qgRte_fakeSelection'); },
	}
}


Rte.init();
