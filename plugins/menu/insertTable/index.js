/* insert table */
import * as rte from './../../../x/rte.js';

edi.ui.setItem('Table', {
	click() {
		let table = c1.dom.fragment('<table><tr><td>&nbsp;<td>&nbsp;<tr><td>&nbsp;<td>&nbsp;</table>').firstChild;
		let r = getSelection().getRangeAt(0);
		r.deleteContents();
		r.insertNode(table);
		getSelection().collapse(table.c1Find('td'),0);
	},
	enable(){
		return !rte.isBlockLess(edi.active);
	}
});