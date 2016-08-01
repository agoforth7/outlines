var $ = require('jquery');
var Backbone = require('backbone');

var devicePixelRatio = window.devicePixelRatio;
var domUrl = window.URL || window.webkitURL || window;

module.exports = Backbone.View.extend({

	tagName: 'canvas',

	className: 'canvas-editor',

	events: {
		'mousedown': 'onMousedown',
		'mousemove': 'onMousemove',
		'mouseup': 'onMouseup'
	},

	initialize: function (options) {
		window.canvas = this;
		this.page = options.page;
		this.library = options.library;
		this.step = this.step.bind(this);
		this.resize = this.resize.bind(this);
		// The images object is a key/value collection where
		// the keys are lineartIds and the values are the
		// images we generate for the SVGs.
		this.images = {
			// id: Image
		};
		
		this.context = this.el.getContext('2d');
		
		$(window).on('resize', this.resize);
	},

	render: function () {
		var _this = this;
		// Get the DOM reference to the canvas element.
        setTimeout(function () {
            _this.resize();
        }, 0);
	},

	resize: function () {
		var width;
		var height;

		if (!this.el.parentElement) {
			return;
		}

		width = this.el.parentElement.clientWidth;
		height = width * 1.3;

		this.el.width = width * devicePixelRatio;
		this.el.height = height * devicePixelRatio;

		this.el.style.width = width + 'px';
		this.el.style.height = height + 'px';
	},

	addImage: function (lineartId) {
		var image = new Image();

		var lineart = this.library.find({ id: lineartId });

		// Create a 'file'
		var file = new Blob([ lineart.get('img') ], { type: 'image/svg+xml;charset=utf-8' });
		// Create a URL for the 'file'
		var src = domUrl.createObjectURL(file);

		image.onload = function () {
			// Remove the URL (free up resources)
			// domUrl.revokeObjectURL(src);
		};

		image.src = src;

		this.images[lineartId] = image;
	},

	start: function () {
		var _this = this;
		requestAnimationFrame(function step () {
			_this.step();
			requestAnimationFrame(step);
		});
	},

	step: function () {
		var object;
		var objects = this.page.get('objects');
		var image;
		var width;
		var height;

		this.clear();

		for (var i = 0; i < objects.length; i++) {
			object = objects[i];
			image = this.images[object.lineartId];
			if (!image) {
				this.addImage(object.lineartId);
			} else {
				width = 300;
				height = width * image.height / image.width;
				
				object.width = width * devicePixelRatio;
				object.height = height * devicePixelRatio;

				this.drawImage(image, object.x, object.y, object.width, object.height);
			}
		}
	},

	clear: function () {
		this.context.clearRect(0, 0, this.el.width, this.el.height);
	},

	drawImage: function (image, x, y, width, height) {
		this.context.drawImage(image, x, y, width, height);
	},

	onMousedown: function (e) {
		var objects = this.page.get('objects');

		var canvasPosition = this.el.getBoundingClientRect();
		var mouseX = (e.clientX - canvasPosition.left) * devicePixelRatio;
		var mouseY = (e.clientY - canvasPosition.top) * devicePixelRatio;

		var offsetX;
		var offsetY;

		var object;
		var target;

		for (var i = objects.length - 1; i >= 0; i--) {
			object = objects[i];
			if (mouseX > object.x && mouseX < object.x + object.width) {
				if (mouseY > object.y && mouseY < object.y + object.height) {
					target = object;
					break;
				}
			}
		}

		if (!target) {
			return;
		}

		offsetX = mouseX - target.x;
		offsetY = mouseY - target.y;

		// `object` is the one we are clicking on, because we broke out of the above loop

		this.trigger('select', target, offsetX, offsetY);
	},

	onMousemove: function (e) {
		var canvasPosition = this.el.getBoundingClientRect();
		var mouseX = (e.clientX - canvasPosition.left) * devicePixelRatio;
		var mouseY = (e.clientY - canvasPosition.top) * devicePixelRatio;

		this.trigger('move', mouseX, mouseY);
	},

	onMouseup: function (e) {
		var canvasPosition = this.el.getBoundingClientRect();
		var mouseX = (e.clientX - canvasPosition.left) * devicePixelRatio;
		var mouseY = (e.clientY - canvasPosition.top) * devicePixelRatio;

		this.trigger('up', mouseX, mouseY);
	}

});