import * as rte from './../../../x/rte.js';

Rte.ui.setItem('Insertorderedlist',{
    cmd:'insertorderedlist',
    shortcut:'9',
    enable: () => !rte.isBlockLess(Rte.active) ,
//    enable() { return !rte.isBlockLess(Rte.active); },
    el:c1.dom.fragment('<svg class="-item" viewBox="0 0 32 32"><path d="M12 26h20v4H12zm0-12h20v4H12zm0-12h20v4H12zM6 0v8H4V2H2V0zM4 16.438v1.563h4v2H2v-4.563l4-1.875V12H2v-2h6v4.563zM8 22v10H2v-2h4v-2H2v-2h4v-2H2v-2z"/></svg>').firstChild
});
