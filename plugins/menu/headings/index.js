import * as rte from './../../../x/rte.js';

let opts = Rte.ui.setSelect('Format',{
	click(e) {
		let tag = e.target.getAttribute('value');
		tag && qgExecCommand('formatblock',false,tag);
		let stat = qgQueryCommandValue('formatblock');
		for (let el of opts.children) {
			el.className = el.tagName.toLowerCase()===stat ? '-selected' : '';
		}
	},
	check() {
		let stat = qgQueryCommandValue('formatblock');
		opts.previousElementSibling.innerHTML = Rte.element ? stat : 'Format';
	},
	enable(e) {
		return !rte.isBlockLess(Rte.active);
	}
});


const lang = document.documentElement.lang;

var t = translater({
	Heading:{
		de:'Überschrift',
	},
});

opts.innerHTML =
`<p value=p >Paragraph</p>
<h1 value=h1>${t`Heading`} 1</h1>
<h2 value=h2>${t`Heading`} 2</h2>
<h3 value=h3>${t`Heading`} 3</h3>
<h4 value=h4>${t`Heading`} 4</h4>
<h5 value=h5>${t`Heading`} 5</h5>
<h6 value=h6>${t`Heading`} 6</h6>`


function translater(voc){
	return function(strings, ...keys){
		const string = strings.join('??');
		const translated = voc[string]?.[lang];
		if (translated) {
			var translatedParts = translated.split('??');
			var result = [translatedParts[0]];
			keys.forEach(function(key, i) {
				result.push(keys[i], translatedParts[i + 1]);
			});
			return result.join('');
		}
	}
}

/*
function blockStat(){
	var sel = getSelection();
	var range = sel.getRangeAt(0);

	const start = range.commonAncestorContainer;
	const root = start.closest('[contenteditable]');
	const blockEl = range.commonAncestorContainer.closest('div, h1, h2, h3, h4, h5, h6, p, pre')
	if (root !== blockEl && root.contains(blockEl)) return blockEl.tagName;
}
*/