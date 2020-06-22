document.head.append(
    c1.dom.fragment(
    '<style>'+
    '.qgRte-mark-char.-Br::before { '+
    '	content:"↵";'+
    '	display:inline;'+
    '	display:contents;'+
    '	opacity:.3;'+
    '	margin-left:.2em; '+
    '	font-size:.82em; '+
    '	pointer-events:none; '+ // I don't think it'll do any good
    '}'+
    '</style>')
);

function addMarks(){
    if (!edi.active) return;
    edi.active.querySelectorAll('br').forEach(br=>{
        if (br.previousElementSibling?.classList.contains('-Br')) return;
        var span = document.createElement('span');
        span.className = 'qgRte-mark-char -Br';
        br.before(span);
    });
}
// function removeMarks(){
// 	edi.active.querySelectorAll('.qgRte-mark-char').forEach(el=>el.removeNode())
// 	edi.active.normalize();
// }
// addEventListener('edi-deactivate',removeMarks); // done by script above
addEventListener('edi-activate',addMarks);
addEventListener('edi-input',addMarks);


// firefox 77
// if selection between br and marker, move selection
document.addEventListener('c1-selectionchange-write',function(e){ // make somethin like this for every non-editable element?
    const sel = getSelection();
    var next = sel.anchorNode.childNodes[sel.anchorOffset];
    if (next?.nodeName !== 'BR') return;
    var previous = next.previousSibling;
    if (!previous?.matches('.qgRte-mark-char')) return;
    var range = sel.getRangeAt(0);
    range.setEndBefore(previous);
});





/* test with positions
{ // show br
	document.head.append(
		c1.dom.fragment(
		'<style>'+
		'.qgRte-mark-char.-Br::before { '+
		'	content:"↵";'+
		'	display:inline;'+
		'	display:contents;'+
		'	opacity:.3;'+
		'	margin-left:.2em; '+
		'	font-size:.82em; '+
		'	pointer-events:none; '+ // I don't think it'll do any good
		'}'+
		'</style>')
	);

	const markerMap = new Map();
	function addMarks(){
		if (!edi.active) return;
		edi.active.querySelectorAll('br').forEach(br=>{
			let marker = markerMap.get(br);
			if (!marker) {
				marker = document.createElement('span');
				marker.innerHTML = '↵';
				marker.style.position = 'absolute';
				marker.style.opacity = .6;
				markerMap.set(br, marker);
			}
			var rect = br.getBoundingClientRect();
			marker.style.top = rect.top - 3 + 'px';
			marker.style.left = rect.left + 4 + 'px';
			document.body.append(marker);
		});

		const entries = markerMap.entries();
		for (let [br, marker] of entries) {
			if (br.parentNode) return;
			marker.remove();
			markerMap.delete(br);
		}
	}
	function removeMarks(){
		const entries = markerMap.entries();
		for (let [br, marker] of entries) {
			marker.remove();
			markerMap.delete(br);
		}
	}
	edi.on('deactivate',removeMarks); // done by script above
	edi.on('activate',addMarks);
	edi.on('real-input',addMarks);
}
*/
