var $ = require('jquery');
var Backbone = require('backbone');

//app data
var devicePixelRatio = window.devicePixelRatio || 1, //screen pixel ratio, how dense are pixels?
    aspectRatio      = 0.77273,                      //aspect ratio of the stage h/w
    defaultX         = 1000,                         //default width of the stage
    defaultY         = defaultX * aspectRatio,       //default height of the stage 
    offScreenScale   = 1.5,                          //size of the offscreen relative to the stage
    dragTarget       = null,                         //storage for items being dragged
    mousePosition    = { x : null, y : null };       //store mouse position if needed

var domUrl = window.URL || window.webkitURL || window;

var LineartImage = function LineartImage (image, model, x, y, width, height) {
	this.image = image;
	this.model = model;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

LineartImage.prototype.constructor = LineartImage;
LineartImage.prototype.move = function (x, y) {
	this.x += x || 0;
	this.y += y || 0;
};

LineartImage.prototype.draw = function (c) {
	c.beginPath();
	c.drawImage(
		this.image,
		(this.x / defaultX) * c.canvas.width,
		(this.y / defaultY) * c.canvas.height,
		(this.width / defaultX) * c.canvas.width,
		(this.height / defaultY) * c.canvas.height
	);
	c.closePath();
};

LineartImage.prototype.collision = function (x, y) {
	return x >= this.x &&
			x <= this.x + this.width &&
			y >= this.y &&
			y <= this.y + this.height; 
};


function clear (ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	return ctx;
}

function transfer (target, source) {
	target.drawImage(
		source.canvas,
		0, 0,
		target.canvas.width,
		target.canvas.height
	);
	return source;
}

function createOffScreenCanvas (scale) {
	var offscreen = {};
	offscreen.canvas = document.createElement('canvas');
	offscreen.ctx = offscreen.canvas.getContext('2d');
	offscreen.$c = $(offscreen.canvas);
	offscreen.scale = scale;
	offscreen.canvas.width = defaultX * scale * devicePixelRatio;
	offscreen.canvas.height = offscreen.canvas.width * aspectRatio;
	return offscreen;
}

function paint (target, source, objs) {
	if (objs !== undefined) {
		clear(source);
		clear(target);
		for (var i = 0; i < objs.length; i++) {
			objs[i].draw(source);
		}
	}
	transfer(target, source);
}

module.exports = Backbone.View.extend({

	tagName: 'canvas',

	className: 'canvas-editor',

	events: {
		'mousedown': 'onMousedown',
		'mousemove': 'onMousemove',
		'mouseup': 'onMouseup',
		'dblclick': 'onDoubleClick'
	},

	initialize: function (options) {
		this.page = options.page;
		this.library = options.library;

		this.ctx = this.el.getContext('2d');
		this.offscreen = createOffScreenCanvas(offScreenScale);

		this.imageCache = {};
		this.updateLineartImages();
		
		$(window).on('resize', this.resize.bind(this));
	},

	render: function () {
		var _this = this;
		// Get the DOM reference to the canvas element.
        setTimeout(function () {
			_this.resize();
        }, 10);
	},

	paint: function () {
		paint(this.ctx, this.offscreen.ctx, this.images);
	},

	resize: function () {
		var w = this.el.parentElement.clientWidth;
		var h = w * aspectRatio;

		this.el.width = w * devicePixelRatio;
		this.el.height = h * devicePixelRatio;
		this.el.style.width = w + 'px';
		this.el.style.height = h + 'px';

		this.paint();

		return this.el;
	},


	createImageFile: function (lineartId) {
		var image = new Image(),
			_this = this;

		var lineart = this.library.find({ id: lineartId });

		// Create a 'file'
		var file = new Blob([ lineart.get('img') ], { type: 'image/svg+xml;charset=utf-8' });

		// Create a URL for the 'file'
		var src = domUrl.createObjectURL(file);

		this.imageCache[lineartId] = {
			image: image,
			model: lineart
		};

		image.onload = function () {
			// Remove the URL (free up resources)
			_this.paint();
		};

		image.src = src;
	},

	updateLineartImages: function () {
		this.images = this.getLineartImages();
	},

	// Map each model object to an image
	getLineartImages: function () {
		var images = this.page.get('objects')
			.map(this.modelObjectToLineartImage.bind(this))
			.filter(function (x) {
				return !!x;
			});

		return images;
	},

	// Map each image to a model object
	getModelObjects: function () {
		var objects = this.images
			.map(this.lineartImageToModelObject.bind(this));

		return objects;
	},

	modelObjectToLineartImage: function (obj) {
		var lineartId = obj.lineartId;
		var cachedLineartImage = this.imageCache[lineartId];

		if (!cachedLineartImage) {
			this.createImageFile(obj.lineartId);
			return null;
		}

		var width = cachedLineartImage.model.get('screen-width') * defaultX;
		var aspectRatio = cachedLineartImage.model.get('aspect-ratio');

		return new LineartImage(
			cachedLineartImage.image,
			cachedLineartImage.model,
			obj.x,
			obj.y,
			width,
			width / aspectRatio
		);
	},

	lineartImageToModelObject: function (lineartImage) {
		return {
			lineartId: lineartImage.model.get('id'),
			x: lineartImage.x,
			y: lineartImage.y
		}
	},

	onMousedown: function (e) {
		var rect = this.el.getBoundingClientRect();

		var x = ((e.clientX - rect.left) / this.$el.width()) * defaultX;
		var y = ((e.clientY - rect.top) / this.$el.height()) * defaultY;

		dragTarget      = null;
		mousePosition.x = null;
		mousePosition.y = null;

		for (var i = this.images.length - 1; i >= 0; i--) {
			if (this.images[i].collision(x, y)) {
				dragTarget = this.images[i];
				mousePosition.x = x;
				mousePosition.y = y;
				break;
			}
		}

		if (!dragTarget) {
			return;
		}
	},

	onMousemove: function (e) {
		if (!dragTarget) { return; }

		var rect = this.el.getBoundingClientRect();

		var x = ((e.clientX - rect.left) / this.$el.width()) * defaultX;
		var y = ((e.clientY - rect.top) / this.$el.height()) * defaultY;

		dragTarget.move(
			x - mousePosition.x,
			y - mousePosition.y
		);

		this.paint();

		mousePosition.x = x;
		mousePosition.y = y;
	},

	onMouseup: function () {
		dragTarget      = null;
		mousePosition.x = null;
		mousePosition.y = null;
	}

});