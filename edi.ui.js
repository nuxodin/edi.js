/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */

//import domProxy from 'https://cdn.jsdelivr.net/gh/nuxodin/domProxy/domProxy.js';
import domProxy from './x/domProxy.js';

import * as rte from './x/rte.js';

export class EdiUi {

	items = {};

	constructor(edi) {
		this.edi = edi;

		this.div = domProxy(
		'<div class=qgRteToolbar>'+
			'<div class=-main>'+
			'</div>'+
			'<div class="-more q1Rst" hidden>'+
			'</div>'+
		'</div>'
		)[0];

		// show/hide more
		this.div.addEventListener('mouseenter', ()=> this.moreContainer.hidden = false );
		this.div.addEventListener('mouseleave', ()=> this.moreContainer.hidden = true );

		this.edi.addUiElement(this.div);

		this.mainContainer = this.div.querySelector('.-main');
		this.moreContainer = this.div.querySelector('.-more');

		addEventListener('edi-activate', e=>{
			const config = {};

			const style = getComputedStyle(e.target)
			var cpMenu = style.getPropertyValue('--edi-menu');
			if (cpMenu && cpMenu !== 'none') {
				config.main = cpMenu.split(/\s/);
			}
			var cpMenu = style.getPropertyValue('--edi-menu-more');
			if (cpMenu && cpMenu !== 'none') {
				config.more = cpMenu.split(/\s/);
			}
			if (!config.main) return;

			this.activeItems = {};
			var addItem = n=>{
				if (!this.items[n]) return;
				this.activeItems[n] = this.items[n];
				appendTo.append(this.items[n].el);
			};
			var appendTo = this.mainContainer;
			config.main.forEach(addItem);
			appendTo = this.moreContainer;
			config.more && config.more.forEach(addItem);

			if (Object.keys(this.activeItems).length) {
				document.body.append(this.div);
				this.div.style.opacity = '0';
				this.div.style.pointerEvents = 'none';
				setTimeout(()=>{
					domProxy(this.div).zTop();
					this.div.style.opacity = '1';
					this.div.style.pointerEvents = '';
				},100);
			}
		});
		addEventListener('edi-deactivate', ()=>{
			setTimeout(()=>{ // need timeout because inputs inside have to blur first (ff, no chrome)
				!this.edi.active && this.div.remove() // && this.div.parentNode ??
			},1);
		});
		addEventListener('edi-selectionchange', ()=>{
			//if (!edi.element) return; needed?
			for (let [name,item] of Object.entries(this.activeItems)){
				if (!item.enable || item.enable(this.edi.element)) {
					item.enabled = true;
					item.el.hidden = false;
					if (item.check) {
						const act = item.check(this.edi.element) ? 'add' : 'remove';
						item.el.classList[act]('active');
					}
				} else {
					item.enabled = false;
					item.el.hidden = true;
				}
			}
		});

		// move toolbar to selection
		addEventListener('edi-selectionchange', async e=>{
			//if (!this.edi.active) return;
			if (this.moreContainer.hidden === false) return; // mouseover
			const margin = getSelection().isCollapsed ? 100 : 20;
			const {Placer} = await import('./x/Placer.js');
			const placer = new Placer(this.div, {
				x:'center',
				y:'after',
				margin,
			});
			placer.toClientRect(qgSelection.rect());
		});

		// shortcut-listener
		var shortcutListener = e=>{
			if (!e.ctrlKey || e.metaKey || e.shiftkey || e.altkey) return;
			for (let [name,item] of Object.entries(this.activeItems)){
				if (!item.enabled) continue;
				if (item.shortcut === e.code || item.shortcut === e.key) {
					let event = new MouseEvent('mousedown',{'bubbles': true,'cancelable': true});
					item.el.dispatchEvent(event);
					e.preventDefault();
				}
			}
		};
		addEventListener('edi-activate', ()=> document.addEventListener('keydown', shortcutListener, false) );
		addEventListener('edi-deactivate', ()=> document.removeEventListener('keydown', shortcutListener, false) );

	}
	setItem(name, opt) {
		if (!opt.el) {
			opt.el = domProxy('<span class=-item></span>')[0];
		}

		if (opt.cmd) {
			if (!opt.click && opt.click != false) opt.click = ()=>rte.execCommand(opt.cmd, false);
			if (!opt.check && opt.check != false) opt.check = ()=>rte.queryCommandState(opt.cmd);
		}
		var enable = opt.enable;
		if (enable && enable.toLowerCase) {
			opt.enable = el => el && el.matches(enable);
			// opt.enable = el => { // todo?
			// 	if (!el) return false;
			// 	let target = el.closest(enable);
			// 	return edi.active !== target && edi.active.contains(target);
			// }
		}
		opt.click && opt.el.addEventListener('mousedown',e=>{
			edi.manipulate( ()=>opt.click(e) ); // todo: manipulate schon hier??
		}, false);
		opt.shortcut && opt.el.setAttribute('title','ctrl+'+opt.shortcut);
		this.items[name] = opt;
		return opt.el;
	}
	setSelect(name, opt) {
		let timeout = null;

		let $el = domProxy('<div class="-item -select"><div class=-state></div><div class=-options></div></div>');
		$el.on('mousedown', e=> { opts.style.display = 'block'; e.preventDefault(); })
		$el.on('mouseover', e=> clearTimeout(timeout))
		$el.on('mouseout',  e=> timeout = setTimeout(()=> opts.style.display = 'none' ,300))

		/*
		let el = c1.dom.fragment('<div class="-item -select"><div class=-state></div><div class=-options></div></div>').firstChild;
		el.addEventListener('mousedown', e=> { opts.style.display = 'block'; e.preventDefault(); });
		el.addEventListener('mouseover', e=> clearTimeout(timeout) );
		el.addEventListener('mouseout',  e=> timeout = setTimeout(()=> opts.style.display = 'none' ,300) );
		*/
		let opts = $el.querySelector('.-options')[0];
		opt.el = $el[0];
		this.setItem(name,opt);
		return opts;
	}
};
