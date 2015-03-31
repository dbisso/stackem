/* global jQuery:true, _:true */

/**
 * StackEm
 *
 * A simple element stacking plugin to minimise space beween vertical
 * elements. Only works with equal width vertical columns.
 *
 * @example
 * var stack = new DBisso.Stackem({
 *  wrapperSelector: '.wrapper',
 *  itemSelector: '.list-item'
 * });
 *
 * stack.init(); // Build the stack.
 * stack.remove(); // Undo to stacking.
 *
 * @param {Object} $ jQuery
 * @param {Object} DBisso Global namespace to nest things in
 * @author Dan Bissonnet <dan@danisadesigner.com>
 * @exports DBisso.StackEm
 */
(function($, DBisso){
	/**
	 * Process the item, placing it in the column with the smallest
	 * height. Every instance shares this function.
	 *
	 * @param  {int} i              Index of item in original order.
	 * @param  {DOMElement} element The item element
	 * @param  {Object} grid        Configuration and data object for this grid
	 */
	var stackItem = function( i, element, grid ) {
		var item = $(element),
			position = item.position(),
			top = Math.floor(position.top),
			left = Math.floor( position.left ),
			foundIndex,
			column;

		// Ignore the first row
		if ( i > grid.columns - 1 ) {
			top = _.min(grid.itemBottoms);
			// Which item are we underneath?
			foundIndex = _.indexOf(grid.itemBottoms, top);

			// We need to indicate that the item at foundIndex is
			// no longer in contention for min() so set it to a
			// big number.
			grid.itemBottoms[foundIndex] = 2e10;

			column = grid.itemColumns[foundIndex];

			// Set the column for the items
			grid.itemColumns[i] = column;

			// Use the same left position based on the first row
			left = ( Number(grid.items.eq(column).css('left').replace(/px/,'')) / grid.wrapper.width() * 100 );

			if ( isNaN( left ) ) {
				left = grid.items.eq(column)[0].style.left;
			} else {
				left += '%';
			}
		} else {
			// First row of items are layed out equally accross the whole width
			top = 0;
			left = i * ( 100 / grid.columns ) + '%';
			grid.itemColumns[i] = i;
		}

		grid.itemBottoms.push( top + item.outerHeight(false) );

		item.css({
			'left': left,
			'top': top
		});
	};

	/**
	 * Fixes the height of image elements.
	 *
	 * If the item contains an image and we are using flexible images
	 * (ie.max-width: 100%), then the browser has to calculate the height
	 * and tends to round the value down. However we might want to round up
	 * instead so that there are no gaps between items. We have to
	 * universally add a pixel.

	 * @param  {DOMElement} item The item element
	 */
	function fixHeight( item ) {
		$(item).find('img').each( function(i, image ) {
			image.style.height = 'auto';
			image.style.height = image.height + 1 + 'px';
		});
	}

	/**
	 * Sets up the stack, calling stackItem() for each item and
	 * applying the positioning.
	 *
	 * @return {Object} The grid configuration object
	 */
	var initStack = function() {
		var self = this,
			options = self.options,
			wrapper = $( options.wrapperSelector ).addClass('stackem--init'),
			lastRow;

		var grid = self.grid = {
			columns: options.columns || wrapper.data('stackem-columns') || 3,
			items: wrapper.find(options.itemSelector), // The items
			resize: options.resize || true, // Automatically reload grid on resize
			wrapper: wrapper, // Wrapper element
			itemColumns: {}, // Hash of item_index : column_index
			itemBottoms: [] // Array of bottom position of each item
		};

		wrapper.attr('data-stackem-columns', grid.columns);


		grid.items.each(function(i, el) {
			if ( options.fixHeights ) {
				fixHeight( el );
			}

			stackItem( i, el, grid );
			$(el).addClass('stackem--item-is-done');
		} ).css({
			'position':'absolute'
		});

		// Reset the height based on new stacked layout.
		lastRow = _.reject(grid.itemBottoms, function(num) { return num === 2e10; });
		wrapper.height( _.max(lastRow) );

		wrapper.addClass('stackem--is-done');

		return grid;
	};

	var init = function() {
		this.bindResize();
		this.initStack();
	}

	var bindResize = function bindResize() {
		var self = this;

		$(window).resize( _.throttle( function(){
			self.remove();
			self.initStack();
		}, 500 ) );
	};

	/**
	 * Removes the stacking from the items
	 *
	 * @param {Object} grid Optionally specify a grid object to remove.
	 */
	var removeStack = function(customGrid) {
		var grid = customGrid || this.grid;

		// var event = new Event('remove');
		// event.grid = grid;

		// grid.wrapper.get()[0].dispatchEvent(event);

		grid.itemBottoms = [];
		grid.wrapper.css('height', '');
		grid = {};
	};

	/**
	 * StackEm Constructor
	 * @param {Object} options
	 */
	function StackEm(options) {
		// New is optional
		if ( ! ( this instanceof StackEm ) ) {
			return new StackEm( options );
		}

		this.options = options;
		this.grid = {};
	}

	StackEm.prototype.init = init;
	StackEm.prototype.remove = removeStack;
	StackEm.prototype.bindResize = bindResize;
	StackEm.prototype.initStack = initStack;

	/**
	 * @namespace Expose the public API
	 */
	DBisso.StackEm = StackEm;
})(jQuery, window.DBisso = window.DBisso || {});