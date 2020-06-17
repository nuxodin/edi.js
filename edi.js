// todo: https://github.com/guardian/scribe/blob/master/BROWSERINCONSISTENCIES.md
// good range tutorial: https://javascript.info/selection-range

/*
css api:

--edi:true;
--edi-show: br shy table | default;
--edi-menu: inline | top | none;
--edi-menu-main: bold italic heading
--edi-menu-more: unorderedList orderedList code
--edi-menu-style: dark | light | auto
--edi-clean: strict|none|normal???
// some api like this? --edi-allowed:p, a, img[width][height], ul>li, .highlight

*/

import './crossbrowser.js';
import './Rte.js';
import './clean.js';
import './Rte.ui.js';
import './Rte.ui.items.js';

import './plugins/show/table/index.js';
import './plugins/show/shy/index.js';
import './plugins/show/br/index.js';
import './plugins/show/imageResize/index.js';

import './plugins/menu/code/index.js';
import './plugins/menu/styles/index.js';
import './plugins/menu/clean/index.js';
import './plugins/menu/bold/index.js';
import './plugins/menu/italic/index.js';
import './plugins/menu/unorderedList/index.js';
import './plugins/menu/orderedList/index.js';
import './plugins/menu/headings/index.js';
