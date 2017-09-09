var cssProxy = (function () {
'use strict';

var decamelize = function (str, sep) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	sep = typeof sep === 'undefined' ? '_' : sep;

	return str
		.replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
		.toLowerCase();
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var rgbHex = createCommonjsModule(function (module) {
'use strict';
/* eslint-disable no-mixed-operators */
module.exports = function (red, green, blue, alpha) {
	var isPercent = (red + (alpha || '')).toString().includes('%');

	if (typeof red === 'string') {
		var res = red.match(/(0?\.?\d{1,3})%?\b/g).map(Number);
		// TODO: use destructuring when targeting Node.js 6
		red = res[0];
		green = res[1];
		blue = res[2];
		alpha = res[3];
	} else if (alpha !== undefined) {
		alpha = parseFloat(alpha);
	}

	if (typeof red !== 'number' ||
		typeof green !== 'number' ||
		typeof blue !== 'number' ||
		red > 255 ||
		green > 255 ||
		blue > 255) {
		throw new TypeError('Expected three numbers below 256');
	}

	if (typeof alpha === 'number') {
		if (!isPercent && alpha >= 0 && alpha <= 1) {
			alpha = Math.round(255 * alpha);
		} else if (isPercent && alpha >= 0 && alpha <= 100) {
			alpha = Math.round(255 * alpha / 100);
		} else {
			throw new TypeError(("Expected alpha value (" + alpha + ") as a fraction or percentage"));
		}
		alpha = (alpha | 1 << 8).toString(16).slice(1);
	} else {
		alpha = '';
	}

	return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1) + alpha;
};
});

//all properties are available
//using getComputedStyle(element)
//document.documentElement gets :root pseudo stuff
function cssProxy(
    element,
    props,
    pseudo
){
    if ( element === void 0 ) element = document.documentElement;
    if ( props === void 0 ) props = {};

    if(typeof props !== 'object'){
        props = {};
    }

    var allstyles = getComputedStyle(element, pseudo);

    function getName(name){
        //Computed styles contain all the properties.
        if(allstyles[name] === void 0){
            //supporting camelcase properties
            return '--'+decamelize(name, '-');
        }
        return decamelize(name, '-');
    }

    var css = Object.assign(Object.create(null), ( obj = {
        setProperty: function setProperty(name, value, priority){
            element.style.setProperty(name, value, priority);
        },
        getProperty: function getProperty(name){
            return allstyles.getPropertyValue(name);
        },
        cssGet: function cssGet(name){
            if(nameOnElement(element, name)){
                return element.style[name];
            }
            var v = this.getProperty(getName(name));
            return !v || !v.length ? undefined : v.trim();
        },
        cssSet: function cssSet(name, value, priority){
            this.setProperty(getName(name), convertValue(value), priority);
        },
        remove: function remove(name){
            element.style.removeProperty(name);
        },
        setAll: function setAll(){
            var this$1 = this;
            var propObjects = [], len = arguments.length;
            while ( len-- ) propObjects[ len ] = arguments[ len ];

            propObjects.forEach(function (props){
                Object.keys(props).forEach(function (key){
                    this$1.cssSet(key, props[key]);
                });
            });
            return this;
        }
    }, obj[Symbol.toPrimitive] = function (hint){
            return '[object CSSProxy]';
        }, obj ));
    var obj;

    var proxy = new Proxy(css, {
        get: function get(target, name){
            //Return methods
            if(typeof target[name] === 'function')
                { return target[name].bind(target); }
            //Return properties
            return target.cssGet(name);
        },
        set: function set(target, name, value){
            target.cssSet(name, value);
            return true;
        }
    });

    Object.keys(props).forEach(function (key){
        proxy[key] = props[key];
    });

    return proxy;
}

function nameOnElement(e, name){
    return !/[-]{2}/.test(name) && e.style[name] !== undefined;
}

/*
Setting variables, from variables works different.
document.documentElement.style.setProperty("--my-bg-colour", "var(--my-fg-colour)");*/
function convertValue(value){
    if(/[-]{2}/.test(value + '')){
        return ("var(--" + (decamelize(value + '')) + ")");
    }else {
        return value;
    }
}

return cssProxy;

}());
//# sourceMappingURL=css-proxy.js.map
