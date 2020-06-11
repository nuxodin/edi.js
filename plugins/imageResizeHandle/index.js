// image resize handles

document.addEventListener('mousedown', e=>{
	if (e.button !== 0) return;
	if (!e.target.isContentEditable) return;
	if (e.target.tagName !== 'IMG') return;
	ResizeUi(e.target);
}, true); // capture => if inside stoppropagation


let checkIntr;
let img = null;
function ResizeUi(newImg) {
    img = newImg;
    let hide = function(e) {
        if (!e || e.target!==img) {
            cont.remove();
            document.removeEventListener('mousedown',hide);
        }
    };
    document.addEventListener('mousedown',hide);
    document.body.append(cont);
    cont.c1ZTop();
    positionize();
    function check() {
        cont.parentNode && img.offsetHeight ? positionize() : (hide(), clearInterval(checkIntr));
    }
    clearInterval(checkIntr);
    checkIntr = setInterval(check, 100);
};
let positionize = function() {
    let c      = img.getBoundingClientRect(), // todo: fastdom
        body   = document.documentElement.getBoundingClientRect(),
        bottom = c.bottom - body.top  - 6,
        right  = c.right  - body.left - 6;
    requestAnimationFrame(()=>{
        X.style.left    = right + 'px';                       X.style.top    = (bottom - img.offsetHeight / 2) + 'px';
        Y.style.left    = (right - img.offsetWidth / 2)+'px'; Y.style.top    = bottom + 'px';
        XY.style.left   = right + 'px';                       XY.style.top   = bottom + 'px';
        info.style.left = right + 16 + 'px';                  info.style.top = bottom + 16 + 'px';
    });
};
let startFn = function(e) {
    let startM   = {x: e.pageX, y: e.pageY};
    let startDim = {x: img.offsetWidth, y: img.offsetHeight};
    let dragger = e.target;
    let moveFn = function(e) {
        let w = dragger === Y ? startDim.x : Math.max(1, startDim.x + e.pageX - startM.x);
        let h = dragger === X ? startDim.y : Math.max(1, startDim.y + e.pageY - startM.y);
        if (!e.ctrlKey && dragger === XY) {
            if (startDim.x / startDim.y < w / h) {
                h = parseInt(startDim.y / startDim.x * w);
            } else {
                w = parseInt(startDim.x / startDim.y * h);
            }
        }
        let dh = parseFloat(h - startDim.y);
        let dw = parseFloat(w - startDim.x);
        requestAnimationFrame(()=>{
            img.style.width  = w + 'px';
            img.style.height = h + 'px';
            info.innerHTML = w+' x '+h+' ('+(dw>0?'+'+dw:dw)+','+(dh>0?'+'+dh:dh)+')';
            info.style.display = 'block';
            info.c1ZTop();
        })
        positionize();
    };
    let stopFn = function() {
        img.dispatchEvent(new Event('qgResize',{bubbles:true}));
        document.removeEventListener('mousemove', moveFn);
        document.removeEventListener('mouseup', stopFn);
    };
    document.addEventListener('mousemove', moveFn);
    document.addEventListener('mouseup', stopFn);
    e.preventDefault();
    e.stopPropagation();
};
let itemCss = ';position:absolute; background-color:#fff; border:1px solid black; height:12px; width:12px; box-sizing:border-box';

const el = document.createElement('template');
el.innerHTML = '<div class=q1Rst style="position:absolute; top:0; left:0; width:100%; height:0">'+
    '<div class=-x  style="cursor:e-resize '+itemCss+'"></div>'+
    '<div class=-y  style="cursor:s-resize '+itemCss+'"></div>'+
    '<div class=-xy style="cursor:se-resize'+itemCss+'" title="press ctrl to disable aspect ratio"></div>'+
    '<div class=-info style="position:absolute; background: #fafafa; box-shadow:0 0 3px; font-size:11px; color:#333; padding:2px 4px; border-radius:2px"></div>'+
'</div>';
const cont = el.content.firstChild;

let X  = cont.querySelector('.-x');
let Y  = cont.querySelector('.-y');
let XY = cont.querySelector('.-xy');
let info = cont.querySelector('.-info');
cont.addEventListener('mousedown', startFn);
