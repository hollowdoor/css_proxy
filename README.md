css-proxy
========

Install
------

`npm install --save css-proxy`

Usage
----

```javascript
//script.js
import cssProxy from 'css-proxy';
//Calling cssProxy without an element uses document.documentElement
let css = cssProxy();

//The body background-color will change to green
//cssProxy decamelizes bgColor to bg-color
css.bgColor = 'green';
```

```css
/*styles.css*/
:root {
    --bg-color: red;
}

body {
    transition: color 1s, background-color 1s;
    background-color: var(--bg-color);
}
```

The HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
    <link rel="stylesheet" type="text/css" href="styles.css" />
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>Hello universe too!</p>
    <script src="script.js"></script>
  </body>
</html>
```

The API
-------

### cssProxy(element, props, pseudo) -> css

The default for `element` is document.documentElement. `element` can be passed a DOM element of your choosing.

Pass a POJO to `props` to set them on `element.style`.

Pass a pseudo-element to `pseudo` for `getComputedStyle(element, pseudo)`.

`cssProxy()` with all it's parameters:

```javascript
let css = cssProxy(
    document.querySelector('.my-element'),
    {
        backgroundColor: '#000',
        color: 'white',
        customProperty: 'red'
    },
    ':hover'
);
```

Setting properties
------------------

Set, and get what ever properties you like on the object returned by `cssProxy()`. This includes properties that correspond to `element.style.color`, or `element.style['any css property']`.

You can set [CSS custom properties](https://developers.google.com/web/updates/2016/02/css-variables-why-should-you-care#working_with_custom_properties_in_javascript) too.

Like:

```javascript
let css = cssProxy(document.querySelector('.my-element'));
//A normal css property
css.backgroundColor = 'blue';
//A css custom property
css.bgColor = 'green';
```

Methods
-------

### css.setProperty(name, value, priority)

This equivalent to `CSSStyleDeclaration.setProperty()`.

### css.getProperty(name)

This is equivalent to `CSSStyleDeclaration.getPropertyValue()`.

### css.cssGet(name)

`css.cssGet()` works like `css.getProperty()`, but `css.cssGet()` also decamelizes the `name` parameter.

### css.cssSet(name, value, priority)

`css.cssSet()` works like `css.setProperty()`, but `css.cssSet()` decamelizes the `name` parameter, and changes a `value` of `--custom-property`, or `--customProperty` to `var(--custom-property)`. You also pass `var(--custom-property)`, or any other valid CSS property value to the `value` argument.

### css.remove(prop)

Remove the style property from the `element`.

### css.setAll(object)

From `object` add it's properties, and values to `element.style`.


Notes
----

`getComputedStyle` is used by css-proxy. `getComputedStyle` is not supported by IE, but we don't care about that because we're using Proxy. Also `new Proxy(object, handler)` is not supported by all browsers either.
