"use strict";
const cssProxy = require('../');

let css = cssProxy();

setTimeout(()=>{
    console.log('css.bgColor ',css.bgColor);
    css.bgColor = 'blue';
    cssProxy(document.body).color = 'red';
    let h1css = cssProxy(document.querySelector('h1'))
    h1css.backgroundColor = 'purple';
    console.log('h1css.backgroundColor ',h1css.backgroundColor);
    console.log(document.querySelector('h1').style.backgroundColor);
    console.log('css.bla ',css.bla)
    console.log(css + '');
}, 2000);
