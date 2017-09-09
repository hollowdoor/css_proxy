import decamelize from 'decamelize';
import rgbHex from 'rgb-hex';

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

export default cssProxy;
//# sourceMappingURL=bundle.es.js.map
