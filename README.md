# microtask

> A pure JavaScript cross browser microtask.
>
> [![Dependencies][david-image]][david-url]

### Usage

```js
microtask(function() {
  console.log('Hello, World!');
});

microtask(function(message) {
  console.log(message);
}, 'Hello, World!');
```

### Examples

> [examples/index.html](https://nuintun.github.io/microtask/examples/index.html)

### Thanks

> [calvinmetcalf/immediate](https://github.com/calvinmetcalf/immediate)

[david-image]: http://img.shields.io/david/dev/nuintun/microtask.svg?style=flat-square
[david-url]: https://david-dm.org/nuintun/microtask?type=dev
