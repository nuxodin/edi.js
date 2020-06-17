import * as rte from "../../x/rte.js";

addEventListener('DOMContentLoaded',function(){

    var codeView = document.createElement('textarea');
    codeView.style.flex = '1 1 auto'
    document.body.appendChild(codeView);

    function update(target){
        if (!target.isContentEditable) return;
        var selection = getSelection();

        var originalRange = selection.getRangeAt(0)
        var startRange = originalRange.cloneRange();
        var endRange = originalRange.cloneRange();


        endRange.collapse(false)
        let marker2 = document.createTextNode('◀')
        endRange.insertNode(marker2);

        startRange.collapse(true);
        let marker1 = document.createTextNode('▶')
        startRange.insertNode(marker1);

        var view = target.innerHTML;

        marker1.remove();
        marker2.remove();

//        target.normalize();
//        selection.addRange(originalRange);

        codeView.innerHTML = view;


        var range = selection.getRangeAt(0);
        if (!range.startContainer.closest('[contenteditable]')) return;

        for (let el of rte.rangeToInlineElements(range)) {
            console.log(el)
            el.style.color = 'red';
        }
        return

        console.log('start rangeWalker');
        for (let el of rte.rangeWalker(range)) {
            console.log(el)
        }
        console.log('end rangeWalker');



    }

    let tO = null;
    const updateDelayed = function(target){
        clearTimeout(tO);
        tO = setTimeout(function(){
            update(target)
        },1000)
    }





    document.addEventListener('input',function(e){
        updateDelayed(e.target)
    });
    document.addEventListener('focus',function(e){
        updateDelayed(e.target)
    });
    document.addEventListener('blur',function(e){
        updateDelayed(e.target)
    }, true);
    document.addEventListener('selectionchange',function(e){
        var range = getSelection().getRangeAt(0)
        var target = range.commonAncestorContainer.closest('[contenteditable]');
        target && updateDelayed(target)
    });



    // log events
    var div = document.createElement('div');
    div.style.cssText = 'max-height:90vh; overflow:auto; white-space:nowrap;'

    document.body.append(div);
    div.innerHTML = '<table><tbody>';
    var tbody = div.querySelector('tbody');
    function log(e){
        tbody.insertAdjacentHTML('beforeend', '<tr><td>' + e.type + '<td>' + e.target);
        div.scrollTo({top:div.scrollHeight, left:0, behavior: 'smooth'});
    }
    document.addEventListener('input',log);
    document.addEventListener('selectionchange',log);
    document.addEventListener('blur',log);
    document.addEventListener('focus',log);


})
