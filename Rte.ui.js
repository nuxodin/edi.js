/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */
//import '../c1/Placer.js?qgUniq=674ed19';
import './Rte.js';
import './x/c1Dom.js';

class EdiUi {
	constructor() {
		this.items = {}

		this.div = document.createElement('div');
		this.div.className = 'qgRteToolbar';
		this.div.addEventListener('mousedown',  e=>e.stopPropagation());
		this.div.addEventListener('touchstart', e=>e.stopPropagation());

		Rte.addUiElement(this.div);

		this.mainContainer = document.createElement('div');
		this.mainContainer.className = '-main';
		this.div.append(this.mainContainer);

		this.moreContainer = document.createElement('div');
		this.moreContainer.className = '-more q1Rst';
		this.moreContainer.hidden = true;
		this.div.append(this.moreContainer);

		Rte.on('activate', ()=>{
			var config = this.config['rteDef']; // todo
			this.activeItems = {};
			var addItem = n=>{
				if (!this.items[n]) return;
				this.activeItems[n] = this.items[n];
				appendTo.append(this.items[n].el);
			};
			var appendTo = this.mainContainer;
			config.main.forEach(addItem);
			appendTo = this.moreContainer;
			config.more.forEach(addItem);

			if (Object.keys(this.activeItems).length) {
				document.body.append(this.div);
				this.div.style.opacity = '0';
				this.div.style.pointerEvents = 'none';
				this.mouseover = 0;
				setTimeout(()=>{
					this.div.c1ZTop();
					this.div.style.opacity = '1';
					this.div.style.pointerEvents = '';
				},100);
			}
		});
		Rte.on('deactivate', ()=>{
			setTimeout(()=>{ // need timeout because inputs inside have to blur first (ff, no chrome)
				!Rte.active && this.div.remove() // && this.div.parentNode ??
			},1);
		});
		Rte.on('selectionchange', ()=>{
			//if (!Rte.element) return; needed?
			for (let [name,item] of Object.entries(this.activeItems)){
				if (!item.enable || item.enable(Rte.element)) {
					item.enabled = true;
					item.el.hidden = false;
					if (item.check) {
						const act = item.check(Rte.element) ? 'add' : 'remove';
						item.el.classList[act]('active');
					}
				} else {
					item.enabled = false;
					item.el.hidden = true;
				}
			}
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
		Rte.on('activate', ()=> document.addEventListener('keydown', shortcutListener, false) );
		Rte.on('deactivate', ()=> document.removeEventListener('keydown', shortcutListener, false) );

		// show/hide more
		this.div.addEventListener('mouseenter', ()=> this.moreContainer.hidden = false );
		this.div.addEventListener('mouseleave', ()=> this.moreContainer.hidden = true );


		// move toolbar to selection
		Rte.on('selectionchange', async ()=>{
			if (!Rte.active) return;
			if (this.mouseover) return;
			const margin = getSelection().isCollapsed ? 100 : 20;
			const {Placer} = await import('./x/Placer.js');
			const placer = new Placer(this.div, {
				x:'center',
				y:'after',
				margin,
			});
			placer.toClientRect(qgSelection.rect());
		});

	}
	setItem(name, opt) {
		if (!opt.el) {
			opt.el = document.createElement('span');
			opt.el.className = '-item -'+name;
		}
		if (opt.cmd) {
			if (!opt.click && opt.click != false) opt.click = ()=>qgExecCommand(opt.cmd, false);
			if (!opt.check && opt.check != false) opt.check = ()=>qgQueryCommandState(opt.cmd);
		}
		var enable = opt.enable;
		if (enable && enable.toLowerCase) {
			opt.enable = el => el && el.matches(enable);
			// opt.enable = el => { // todo?
			// 	if (!el) return false;
			// 	let target = el.closest(enable);
			// 	return Rte.active !== target && Rte.active.contains(target);
			// }
		}
		opt.click && opt.el.addEventListener('mousedown',e=>{
			Rte.manipulate( ()=>opt.click(e) ); // todo: manipulate schon hier??
		}, false);
		opt.shortcut && opt.el.setAttribute('title','ctrl+'+opt.shortcut);
		this.items[name] = opt;
		return opt.el;
	}
	setSelect(name, opt) {
		let timeout = null;
		let el = c1.dom.fragment('<div class="-item -select"><div class=-state></div><div class=-options></div></div>').firstChild;
		el.addEventListener('mousedown', e=> { opts.style.display = 'block'; e.preventDefault(); });
		el.addEventListener('mouseover', e=> clearTimeout(timeout) );
		el.addEventListener('mouseout',  e=> timeout = setTimeout(()=> opts.style.display = 'none' ,300) );
		let opts = el.c1Find('>.-options');
		opt.el = el;
		this.setItem(name,opt);
		return opts;
	}
};

Rte.ui = new EdiUi();
