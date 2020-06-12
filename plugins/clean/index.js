/* clean / remove format */

const removeTags = ['FONT','O:P','SDFIELD','SPAN'].reduce((obj, item)=>{ obj[item]=1; return obj; }, {});
function cleanNode(node) {
    if (!node) return;
    cleanContents(node);
    node.nodeType === Node.COMMENT_NODE && node.remove();
    if (node.nodeType === Node.ELEMENT_NODE) {
        if (!Rte.active.contains(node)) return;
        node.removeAttribute('style');
        node.removeAttribute('class');
        node.removeAttribute('align');
        node.removeAttribute('valign');
        node.removeAttribute('border');
        node.removeAttribute('cellpadding');
        node.removeAttribute('cellspacing');
        node.removeAttribute('bgcolor');
        removeTags[node.tagName] && node.removeNode();
        if (node.tagName !== 'IMG') {
            node.removeAttribute('width');
            node.removeAttribute('height');
        }
    }
}
function cleanContents(node){
    if (node.childNodes) for (let child of node.childNodes) cleanNode(child);
}

Rte.ui.setItem('Removeformat', {
    click(e) {
        let root = e.ctrlKey ? Rte.element : Rte.active;
        cleanContents(root);
    }
    ,shortcut:'Space'
});
