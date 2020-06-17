import * as rte from './../../../x/rte.js';

Rte.ui.setItem('Insertunorderedlist',{
    cmd:'insertunorderedlist',
    shortcut:'8',
    enable: () => !rte.isBlockLess(Rte.active) ,
    el:c1.dom.fragment('<svg class="-item" viewBox="0 0 32 32"><path d="M12 2h20v4H12V2zm0 12h20v4H12v-4zm0 12h20v4H12v-4zM0 4a4 4 0 118 0 4 4 0 01-8 0zm0 12a4 4 0 118 0 4 4 0 01-8 0zm0 12a4 4 0 118 0 4 4 0 01-8 0z"/></svg>').firstChild
});
