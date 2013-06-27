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
			ellipsis: ' &hellip; ',
			truncateOnly: false
		},
 
		// Set up the widget
		_create: function () {
			var $el = this.element,
				options = this.options,
				baseClass = this.widgetBaseClass,
				self = this,
				ellipsis = options.ellipsis || '';
			
			// preserve the original text and HTML	
			this.text = $el.text();
			this.html = $el.html();
			
			this._createBaseNodes();
			
			// initial truncate
			if (options.height) {
				this.truncate();
			}
			
			// hide the extra
			if (!options.truncateOnly) {
				this.showLess();
			}
		},
		
		_createBaseNodes: function() {
			var $el = this.element,
				options = this.options,
				baseClass = this.widgetBaseClass;

			// set up the base classes
			$el.wrapInner('<span class="' + baseClass + '-less-content" />')
				.wrapInner('<span class="' + baseClass + '-less" />')
				.append('<span class="' + baseClass + '-more"><span class="' + baseClass + '-more-content"></span></span>')
				.wrapInner('<span class="' + baseClass + ' ui-widget" />');
			
			// find all of the elements
			this.$wrapper = $el.find('.' + baseClass);
			
			// find the less nodes
			this.$less = $el.find('.' + baseClass + '-less');
			this.$lessContent = $el.find('.' + baseClass + '-less-content');

			// find the more nodes
			this.$more = $el.find('.' + baseClass + '-more');
			this.$moreContent = $el.find('.' + baseClass + '-more-content');
			
			if (options.truncateOnly) {
				// create the ellipsis
				this._createEllipsis();
			} else {
				// create the more link and content
				this._createMore();
			}		
		},

		_createMore: function () {
			var $el = this.element,
				options = this.options,
				baseClass = this.widgetBaseClass,
				self = this,
				ellipsis = options.ellipsis || '';
			

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
		},
		
		_createEllipsis: function () {
			var options = this.options,
				baseClass = this.widgetBaseClass,
				ellipsis = options.ellipsis || '';
			
			// get rid of more
			if (this.$more) {
				this.$more.remove();
				this.$more = null;
				this.$moreContent = null;
			}

			// create the ellipsis
			this.$ellipsis = $('<span href="#" class="' + baseClass + '-ellipsis">' + ellipsis + '</span>').appendTo(this.$less);
		},

		_setOption: function (key, value) {
			var options = this.options;

			switch (key) {
				case 'more':
					this.$moreAction.html(options.ellipsis + value);
					break;
				case 'less':
					this.$lessAction.html(value);
					break;
				case 'ellipsis':
					if (options.truncateOnly) {
						this.$ellipsis.html(value);
					} else {
						this.$moreAction.html(value + options.more);
					}
				break;
			}
 
			// In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
			$.Widget.prototype._setOption.apply( this, arguments );
			
			// if the height changes, truncate again
			if (key === 'height') {
				this.truncate();
			}

			// if truncateOnly changes, re-generate the original HTML nodes
			if (key === 'truncateOnly') {
				this.element.empty().html(this.html);
				this._createBaseNodes();
				if (options.height) {
					this.truncate();
				}
			}

		},

		// Use the destroy method to clean up any modifications your widget has made to the DOM
		destroy: function () {
			// undo the create method
			this.element.empty().html(this.html);

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
			var options = this.options;

			// reset the text
			this.$lessContent.text(this.text);
			if (this.$moreContent) { 
				this.$moreContent.text('');
			}
			
			// measure some stuff
			var $el = this.$lessContent,
				length = this.text.length,
				origHeight = this.$less.height(),
				height = origHeight,
				maxHeight = parseInt( this.options.height, 10 ),
				rowHeight = $el.text('i').height(),
				maxRows = maxHeight / rowHeight,
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

			
			// hide the ellipsis if it's not needed.
			var ellipsis = options.truncateOnly ? this.$ellipsis : this.$moreAction;
			if (height === origHeight) {
				ellipsis.hide();
			} else {
				ellipsis.show();
			}

			// add the truncated text back to the page
			if (this.$moreContent) {
				this.$moreContent.html(this.text.substring(length));
			}
		}
		
	});
}( jQuery ) );
