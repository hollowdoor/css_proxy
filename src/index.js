import decamelize from 'decamelize';
import rgbHex from 'rgb-hex';

//all properties are available
//using getComputedStyle(element)
//document.documentElement gets :root pseudo stuff
export default function cssProxy(
    element = document.documentElement,
    props = {},
    pseudo
){
    if(typeof props !== 'object'){
        props = {};
    }

    let allstyles = getComputedStyle(element, pseudo);

    function getName(name){
        //Computed styles contain all the properties.
        if(allstyles[name] === void 0){
            //supporting camelcase properties
            return '--'+decamelize(name, '-');
        }
        return decamelize(name, '-');
    }

    const css = Object.assign(Object.create(null), {
        setProperty(name, value, priority){
            element.style.setProperty(name, value, priority);
        },
        getProperty(name){
            return allstyles.getPropertyValue(name);
        },
        cssGet(name){
            if(nameOnElement(element, name)){
                return element.style[name];
            }
            let v = this.getProperty(getName(name));
            return !v || !v.length ? undefined : v.trim();
        },
        cssSet(name, value, priority){
            this.setProperty(getName(name), convertValue(value), priority);
        },
        remove(name){
            element.style.removeProperty(name);
        },
        [Symbol.toPrimitive](hint){
            return '[object CSSProxy]';
        },
        setAll(...propObjects){
            propObjects.forEach(props=>{
                Object.keys(props).forEach(key=>{
                    this.cssSet(key, props[key]);
                });
            });
            return this;
        }
    });

    const proxy = new Proxy(css, {
        get(target, name){
            //Return methods
            if(typeof target[name] === 'function')
                return target[name].bind(target);
            //Return properties
            return target.cssGet(name);
        },
        set(target, name, value){
            target.cssSet(name, value);
        }
    });

    Object.keys(props).forEach(key=>{
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
        return `var(--${decamelize(value + '')})`;
    }else {
        return value;
    }
}
