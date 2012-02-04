/**
 * Custom UI Widget for truncating text
 */
(function ($) {
	'use strict';
	
	$.widget("ui.truncate", {
		// These options will be used as defaults
		options: {
			height: false,
			more: 'More',
			less: 'Less',
			upper: false,
			lower: false,
			ellipsis: '&hellip; '
		},
 
		// Set up the widget
		_create: function () {
			var $el = this.element,
				options = this.options,
				baseClass = this.widgetBaseClass,
				self = this,
				ellipsis = options.ellipsis || '';
				
			this.text = $el.text();
			
			// set up the base classes
			$el.wrapInner('<span class="' + baseClass + '-less-content" />')
				.wrapInner('<span class="' + baseClass + '-less" />')
				.append('<span class="' + baseClass + '-more"><span class="' + baseClass + '-more-content"></span></span>')
				.wrapInner('<span class="' + baseClass + ' ui-widget" />');
			
			// find all of the elements
			this.$wrapper = $el.find('.' + baseClass);
			this.$less = $el.find('.' + baseClass + '-less').append(document.createTextNode(' ')); // ensure a space between the text and the link
			this.$more = $el.find('.' + baseClass + '-more').append(document.createTextNode(' ')); // ensure a space between the text and the link
			this.$lessContent = $el.find('.' + baseClass + '-less-content');
			this.$moreContent = $el.find('.' + baseClass + '-more-content');
			
			// create the more/less links
			this.$moreAction = $('<a href="#" class="' + baseClass + '-action-more">' + ellipsis + options.more + '</a>').appendTo(this.$less);
			this.$lessAction = $('<a href="#" class="' + baseClass + '-action-less">' + options.less + '</a>').appendTo(this.$more);
			
			// handle events
			this.$moreAction.click(function (e) {
				e.preventDefault();
				self.showMore();
			});
			this.$lessAction.click(function (e) {
				e.preventDefault();
				self.showLess();
			});
			
			// initial truncate
			if (options.height) {
				this.truncate();
			}
			
			// hide the extra
			this.showLess();
			
		},
		
		_setOption: function (key, value) {
			switch (key) {
				case 'more':
				this.$moreAction.html(value);
				break;
				case 'less':
				this.$lessAction.html(value);
				break;
			}
 
			// In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
			$.Widget.prototype._setOption.apply( this, arguments );
			
			// if the height changes, truncate again
			if (key === 'height') {
				this.truncate();
			}
		},
		// Use the destroy method to clean up any modifications your widget has made to the DOM
		destroy: function () {
			//TODO: undo the create method
			
			// In jQuery UI 1.8, you must invoke the destroy method from the base widget
			$.Widget.prototype.destroy.call( this );
		},
		
		showMore: function () {
			this.$moreAction.hide();
			this.$more.show();
		},
		
		showLess: function () {
			this.$moreAction.show();
			this.$more.hide();
		},
		
		truncate: function (test) {
			// reset the text
			this.$lessContent.text(this.text);
			this.$moreContent.text('');
			
			// measure some stuff
			var $el = this.$lessContent,
				length = this.text.length,
				height = this.$less.height(),
				maxHeight = parseInt( this.options.height, 10 ),
				rowHeight = $el.text('i').height(),
				maxRows = maxHeight / rowHeight,
				postfix = this.options.postfix || '',
				ratio,
				done = false,
				n = 0,
				lower = this.options.lower || 0,
				upper = this.options.upper || length;
			
			// loop the string until it's right
			while (!done && n < 20) {
				ratio = height / rowHeight / maxRows;
				
				if (height > maxHeight) {
					if (length < upper) {
						upper = length; // known too big
					}
					length = ratio > 2 ? Math.floor(length/ratio) : Math.floor(length - ((upper - lower)/2));
				}
				// now it's too short
				else if (height < maxHeight || height === maxHeight) {
					if (length > lower) {
						lower = length; // known too small
					}
					length = ratio > 2 ? Math.floor(length/ratio) : Math.floor(length + ((upper - lower)/2));
				}
				
				// now it's perfect
				if (upper - lower === 1 || upper - lower === 0) {
					done = true;
				}
				
				// save the new string
				$el.html(this.text.substring(0, length));
				height = this.$less.height();
				n += 1;
				
			}
			
			// add the truncated text back to the page
			this.$moreContent.html(this.text.substring(length));
		}
		
	});
}( jQuery ) );