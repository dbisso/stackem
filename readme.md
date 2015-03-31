# Stack 'Em

A simple element stacking plugin to minimise space beween vertical elements.

Only works with equal width vertical columns. Work in progress.

## Install

For now:

```
bower install --save https://github.com/dbisso/stackem.git
```

## Use

```html
<div class="wrapper">
	<div class="list-item">
		Some stackable item
	</div>
	<div class="list-item">
		Another stackable item
	</div>
	<div class="list-item">
		Another stackable item
	</div>
	<div class="list-item">
		Another stackable item
	</div>
	<div class="list-item">
		Another stackable item
	</div>
	<div class="list-item">
		Another stackable item
	</div>
	<div class="list-item">
		Another stackable item
	</div>
</div>
```

```css
.wrapper {
	position: relative;
}

.list-item {
	float: left;
	width: 33.33%;
}
```

```js
var stack = new DBisso.Stackem({
	wrapperSelector: '.wrapper',
	itemSelector: '.list-item',
	columns: 4 // Optional. Default: 3. Can be a function which returns an integer
	keepOrder: true // Optional. Default: false. Should the natural column order be maintained.
});
 ```

## Dependencies:

* jQuery
* Underscore
