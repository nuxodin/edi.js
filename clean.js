import {NodeCleaner} from './x/NodeCleaner.js';

// cleaner
{
	let Cleaner;
	addEventListener('edi-input', function(e){
		if (!Cleaner) Cleaner = new NodeCleaner();
		Cleaner.cleanContents(e.target, true);
	});
}

/* force li's in contenteditable uls */
{
	const check = function(e){
		let child;
		for (child of edi.active.childNodes) {
			if (child.tagName === 'LI') continue;
			if (child.nodeType === 3 && !child.textContent.trim()) continue;
			if (child.nodeName === 'UL') {
				child.removeNode();
				continue;
			}
			let li = document.createElement('li');
			child.before(li);
			li.append(child);
		}
	}
	addEventListener('edi-activate', function(e){
		if (e.target.tagName !== 'UL') return;
		check()
		e.target.addEventListener('input', check);
	});
	addEventListener('edi-deactivate', function(e){
		if (e.target.tagName !== 'UL') return;
		e.target.removeEventListener('input', check);
	});
}

/* force p tag inside contenteditable divs */
document.addEventListener('input',function(e){
	if (!e.target.isContentEditable) return;
	if (e.target.tagName !== 'DIV') return;
	const sel = getSelection();
	const range = sel.c1GetRange();
	const text = range.startContainer;
	const offset = range.startOffset;
	if (text.nodeType !== 3) return; // text-node
	if (text.parentNode === e.target) { // warp blank text-nodes with p
		const p = document.createElement('p');
		text.after(p);
		p.append(text);
		range.setStart(text, offset);
		sel.c1SetRange(range);
	} else { // replace every div with a p
		const div = text.parentNode;
		if (div.tagName !== 'DIV') return;
		//if (div.parentNode !== e.target) return;
		const p = document.createElement('p');
		div.after(p);
		p.append(div)
		div.removeNode();
		range.setStart(text, offset);
		sel.c1SetRange(range);
	}
});
/* force p's to not contain a ul */
document.addEventListener('input',function(e){
	if (!e.target.isContentEditable) return;
	if (e.target.tagName !== 'DIV') return;
	const sel = getSelection();
	const range = sel.c1GetRange();
	const text = range.startContainer;
	const offset = range.startOffset;
	if (text.nodeType !== 3) return; // text-node
	const ul = text.parentNode.parentNode;
	if (ul.tagName !== 'UL') return;
	const p = ul.parentNode;
	if (p.tagName !== 'P') return;
	if (p.childNodes.length !== 1) return;
	p.removeNode();
	range.setStart(text, offset);
	sel.c1SetRange(range);
});

/* force br's tag inside contenteditable if not a DIV/TD/TH/UL, (todo, should it be p,h1,h2...?) */
document.addEventListener('keydown',function(e){
	if (!e.target.isContentEditable) return;
	if (e.target.tagName === 'DIV') return;
	if (e.target.tagName === 'TD') return;
	if (e.target.tagName === 'TH') return;
	if (e.target.tagName === 'UL') return;
	if (e.keyCode === 13) {
		const br = document.createElement('br');
		let range = getSelection().c1GetRange();
		range.insertNode(br);
		br.append(document.createTextNode(' \n\n'))
		range.setStartAfter(br)
		getSelection().c1SetRange(range);
		e.preventDefault();
	}
});

/* prevent links inside links */
document.addEventListener('input',function(e){
	if (!e.target.isContentEditable) return;
	if (!e.target.closest('A')) return;
	let a;
	while (a = e.target.c1Find('a')) a.removeNode();
});

/* prevent phx inside phx */
{
	const PHX = {P:1,H1:1,H2:1,H3:1,H4:1,H5:1,H6:1,};
	document.addEventListener('input',function(e){
		if (!e.target.isContentEditable) return;
		const check = function(node) {
			Array.from(node.children).forEach(check); // for of will skip nodes (if some removed)
			if (isPHX(node.parentNode) && isPHX(node)) {
				if (node.nextElementSibling) {
					node.after(document.createElement('br'));
				}
				node.removeNode();
			}
		}
		function isPHX (node){
			return PHX[node.tagName];
		}
		check(e.target)
	});
}
/* */