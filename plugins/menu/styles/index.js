import { Range } from "../../../x/Range.js";
import domProxy from "../../../x/domProxy.js";

/* CSS classes */
function useClass(cl) { return cl.match(/^[A-Z]/); };
let hasClasses; /* check if this-handle is used */
let check = function(el) {
    let classes = getPossibleClasses(el);
    for (let cl of Object.keys(classes)) {
        hasClasses = hasClasses || useClass(cl);
    }
    sopts.parentElement.style.display = hasClasses ? '' : 'none';
}.c1Debounce(150);

let sopts = edi.ui.setSelect('Style', {
    check() {
        check();
        let classes = edi.element && edi.element.className.split(' ').filter(useClass).join(' ') || 'Style';
        sopts.previousElementSibling.innerHTML = classes;
    },
    click() {
        sopts.innerHTML = '';

        let range = Range.fromSelection();
        let el = range.exactElement() || (range.collapsed ? edi.element : null);

        let classes = getPossibleClasses(el);
        for (let sty of Object.keys(classes)) {
            if (!useClass(sty)) return;
            let has = el && el.classList.contains(sty);
            let item = domProxy('<div class="'+sty+'">'+sty+'</div>')[0];
            sopts.append(item);
            has && item.classList.add('-selected');
            item.onmousedown = ()=>{
                edi.manipulate(()=>{
                    if (!el) {
                        el = document.createElement('span');
                        Range.fromSelection().surround(el).select();
                    }
                    el.classList.toggle(sty, !has);
                });
            };
            // d.css({
            // 	fontSize:parseInt(d.css('fontSize')).limit(9,18),
            // 	margin:parseInt(d.css('margin')).limit(0,4),
            // 	padding:parseInt(d.css('padding')).limit(0,4),
            // 	letterSpacing:parseInt(d.css('letterSpacing')).limit(0,11),
            // 	borderWidth:parseInt(d.css('borderWidth')).limit(0,4)
            // });
        }
    }
});


function getPossibleClasses(el) { /* eventuell better performance? */
	var ret = {};
	function test(sel) {
		sel = sel.trim();
		if (!~sel.indexOf('.')) return;
		if (!sel.match(/\.[A-Z]/)) return;
		var reg = el ? new RegExp('(^'+el.tagName+'|^)\\.[^ ]+$', 'i') : new RegExp('^\\.[^ ]+$');
		if (sel.match(reg)) {
			var x = sel.replace(/^(.*\.)([^: ]*)(.*)$/, function(m, a1, a2) { return a2; });
			ret[x] = sel;
		}
	}
	for (let sheet of document.styleSheets) {
		if (sheet.href && sheet.href.indexOf(location.host) === -1) continue; // only inline and same domain
		if (sheet.href === null) {
			try {
				if (sheet.ownerNode.innerHTML === '') continue; // adblock chrome
			} catch {}
		}
        try { // (not same domain) security error in ff
			if (sheet.cssRules)
				for (let rule of sheet.cssRules) {
					if (!rule.selectorText) continue;
	    			rule.selectorText.split(',').forEach(test);
				}
        } catch(e) { console.error(e); }
	}
	return ret;
};
