/* table handles */
import {tableHandles as tH} from '../../../x/tableHandles.js';


let td, tr, table, index;
let handles = new tH();
addEventListener('edi-deactivate',() => handles.hide() );
function positionize() {
    let e = edi.element;
    if (!e) return;
    td = e.closest('td');
    if (edi.active && edi.active.contains(td)) {
        tr = td.parentNode;
        table = tr.closest('table');
        index = td.cellIndex;
        handles.showTd(td);
    } else {
        handles.hide();
    }
}

addEventListener('edi-selectionchange', positionize);
addEventListener('edi-activate', positionize);

handles.root.addEventListener('click',e=>{
    if (e.target.classList.contains('-rowRemove')) {
        tr.remove();
    }
    if (e.target.classList.contains('-rowAdd')) {
        let tr2 = tr.cloneNode(true);
        tr.after(tr2)
    }
    if (e.target.classList.contains('-colRemove')) {
        let trs = table.c1FindAll('> * > tr');
        for (let tr of trs) tr.children[index].remove();
    }
    if (e.target.classList.contains('-colAdd')) {
        let trs = table.c1FindAll('> * > tr');
        for (let tr of trs) {
            let td = c1.dom.fragment('<td>&nbsp;</td>');
            tr.children[index].after(td);
        }
    }
    let hasTds = table.c1FindAll('> * > tr > *').length;
    !hasTds && table.remove();
    getSelection().modify('move', 'right', 'character'); // chrome bug
    getSelection().modify('move', 'left', 'character');
    edi.checkSelection();
});
