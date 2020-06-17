/* clean / remove format */

const removeTags = {FONT:1,'O:P':1,SDFIELD:1,SPAN:1};
const removeAttr = ['style','class','align','valign','border','cellpadding','cellspacing','bgcolor'];

function cleanNode(node) {
    if (!node) return;
    cleanContents(node);
    node.nodeType === Node.COMMENT_NODE && node.remove();
    if (node.nodeType === Node.ELEMENT_NODE) {
        if (!Rte.active.contains(node)) return;
        removeTags[node.tagName] && node.removeNode();
        for (let attr of removeAttr) node.removeAttribute(attr);
        if (node.tagName !== 'IMG') {
            for (let attr of ['width', 'height']) node.removeAttribute(attr);
        }
    }
}
function cleanContents(node){
    if (node.childNodes) for (let child of node.childNodes) cleanNode(child);
}

Rte.ui.setItem('Removeformat', {
    el: c1.dom.fragment('<svg class="-item" viewBox="0 0 32 32"><path d="M0 28h18v4H0zM6 0h22v4H6zm2.668 26l6.396-24.505 3.87 1.01L12.801 26zm20.387 6L25 27.945 20.945 32 19 30.055 23.055 26 19 21.945 20.945 20 25 24.055 29.055 20 31 21.945 26.945 26 31 30.055z"/></svg>').firstChild,
    click(e) {
        let root = e.ctrlKey ? Rte.element : Rte.active;
        cleanContents(root);
    }
    ,shortcut:'Space'
});
