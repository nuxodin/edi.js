/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */
!function(w,d,undf,k) { 'use strict';


/* Waits for the execution of the function (min) and then executes the last call, but waits maximal (max) millisecunds.
*  If the function-scope changes, the function executes immediatly (good for event-delegation)
*/
Function.prototype.c1Debounce = function(options) {
	if (typeof options === 'number') options = {min:options, max:options*2};
	var fn = this,
		inst,
		args,
		timerMin = 0,
		timerMax = 0,
		triggered = true,
	    trigger = function() {
	        triggered = true;
	        clearTimeout( timerMax );
	        clearTimeout( timerMin );
	        timerMax = 0;
	        fn.apply(inst,args);
        };
    var wrapped = function() {
        inst !== this && !triggered && trigger();
        triggered = false;
        inst = this;
        args = arguments;
        clearTimeout(timerMin);
        timerMin = setTimeout(trigger, options.min);
        !timerMax && options.max && (timerMax = setTimeout(trigger, options.max));
    };
    wrapped.trigger = function(){
        args = arguments;
        trigger();
    };
    return wrapped;
};
if (!RegExp.escape) {
    RegExp.escape = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
}
Math.c1Limit = function(number,min,max) {
    return Math.min( Math.max( parseFloat(min) , parseFloat(number) ), parseFloat(max) );
};

w.c1 = w.c1 || {};

/* eventer */
c1.Eventer = {
    _getEvents : function(n) {
        !this._Es && (this._Es={});
        !this._Es[n] && (this._Es[n]=[]);
        return this._Es[n];
    },
	on: function(ns, fn) {
    	ns = ns.split(' ');
    	for (var i=0, n; n = ns[i++];) {
	        this._getEvents(n).push(fn);
    	}
    },
	off: function(ns, fn) {
    	ns = ns.split(' ');
    	for (var i=0, n; n = ns[i++];) {
	        var Events = this._getEvents(n);
	        Events.splice(Events.indexOf(fn) ,1);
    	}
    },
	trigger: function(ns, e) {
        var self = this, n, i=0;
        ns = ns.split(' ');
        while (n = ns[i++]) {
            this._getEvents(n).forEach(function(Event) {
                Event.call(self,e);
            });
    	}
    }
};

/* ext */
c1.ext = function (src, target, force, deep) {
    target = target || {};
    for (k in src) {
    	if (!src.hasOwnProperty(k)) continue;
        if (force || target[k] === undf) {
            target[k] = src[k];
        }
		if (!deep) continue;
		if (typeof k === 'string') continue;
		//if (typeof target[k] === 'string') continue; // todo
        c1.ext(src[k], target[k], force, deep);
    }
    return target;
};



}(window,document);
