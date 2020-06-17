
Rte.ui.setItem('Shy',{
    click(el) {
        Rte.range.deleteContents();
        Rte.range.insertNode(document.createTextNode('\u00AD'));
    },
    el: c1.dom.fragment('<div class="-item -button">Weiches Trennzeichen einfügen</div>').firstChild
});
document.head.append(
    c1.dom.fragment(
    '<style>'+
    '.qgRte-mark-char.-Shy::after  { content:"-"; display:inline-block; color:red; opacity:.3; } '+
    //'.qgRte-mark-char.-Nbsp::after { content:"•"; display:inline-block; color:red; opacity:.3; } '+
    '</style>')
);

function addMarks(){
    // remove
    var anchor = getSelection().anchorNode;
    if (!anchor) return;
    anchor.parentNode.querySelectorAll('.qgRte-mark-char').forEach(function(marker){
        if (!marker.firstChild) marker.remove();
    });

    //matchText(Rte.active, new RegExp('\u00AD|\u00a0', 'g'), function(node, match, offset) {
    matchText(Rte.active, new RegExp('\u00AD', 'g'), function(node, match, offset) {
        if (node.parentNode.classList.contains('qgRte-mark-char')) return false;
        var span = document.createElement('span');
        span.className = 'qgRte-mark-char';
        if (match === '\u00AD') span.className += ' -Shy';
        //if (match === '\u00a0') span.className += ' -Nbsp';
        span.textContent = match;
        return span;
    });
}
function removeMarks(){
    Rte.active.querySelectorAll('.qgRte-mark-char').forEach(el=>el.removeNode())
    Rte.active.normalize();
}
Rte.on('activate',addMarks);
Rte.on('input',addMarks);
Rte.on('deactivate',removeMarks);


var matchText = function(node, regex, callback, excludeElements) {
    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
    var child = node.firstChild;
    while (child) {
        if (child.nodeType === 1) {
            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1) break;
            matchText(child, regex, callback, excludeElements);
        }
        if (child.nodeType === 3) {
            var bk = 0;
            child.data.replace(regex, function(str) {
                var args = [].slice.call(arguments);
                var tag = callback.apply(window, [child].concat(args));
                if (!tag) return false;
                var offset = args[args.length - 2];
                var newTextNode = child.splitText(offset+bk);
                bk -= child.data.length + str.length;
                newTextNode.data = newTextNode.data.substr(str.length);
                child.parentNode.insertBefore(tag, newTextNode);
                child = newTextNode;
            });
            regex.lastIndex = 0;
        }
        child = child.nextSibling;
    }
    return node;
};
