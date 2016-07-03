var topbarheight = 20;

var ToolWidget = function(reference, id, title, width, height) {
	this.height = height;
	
	this.container = document.createElement("div");
	this.container.setAttribute('id', id);
	this.container.setAttribute('class', 'toolwidget');
	this.container.style.overflow = 'hidden';
	reference.appendChild(this.container);
	
	var cstyle = window.getComputedStyle(this.container, null);
	var marginleft = parseInt(cstyle.marginLeft);
	var marginright = parseInt(cstyle.marginRight);
	this.width = width - marginleft - marginright;
	this.container.style.width = this.width.toString() + 'px';
	this.container.style.height = this.height.toString() + 'px';
	
	var topbar = document.createElement("div");
	topbar.setAttribute('class', 'topbar');
	topbar.style.width = '100%';
	topbar.style.height = topbarheight.toString() + 'px';
	this.container.appendChild(topbar);
	
	this.arrow = document.createElement("div");
	this.arrow.setAttribute('class', 'arrow');
	this.arrow.style.width = topbarheight.toString() + 'px';
	this.arrow.style.height = topbarheight.toString() + 'px';
	this.arrow.style.display = 'block';
	this.arrow.style.float = 'left';
	makeTriangle(this.arrow, topbarheight, topbarheight, "down", { fill : '#000000' });
	topbar.appendChild(this.arrow);
	
	var self = this;
	this.arrow.addEventListener('click', function(e) {
		e.preventDefault();
		self.expanded ? self.shrink('slow') : self.expand('slow');
	});
	
	var tit = document.createElement("div");
	tit.style.width = (this.width - topbarheight).toString() + 'px';
	tit.style.height = topbarheight.toString() + 'px';
	tit.style.display = 'block';
	tit.style.float = 'right';
	tit.style.padding = '0px';
	this.title = document.createElement('span');
	this.title.setAttribute('class', 'title');
	this.title.innerHTML = title;
	topbar.appendChild(tit);
	tit.appendChild(this.title);
	
	this.content = document.createElement("div");
	this.content.setAttribute('class', "content");
	this.content.style.width = '100%';
	this.content.style.height = (this.height - topbarheight).toString() + 'px';
	this.content.style.display = 'block';
	this.container.appendChild(this.content);
	
	this.expanded = true;
};

ToolWidget.prototype.expand = function(speed) {
	if (!this.expanded) {
		$(this.container).animate({ height : this.height.toString() + 'px' }, speed);
		this.arrow.innerHTML = "";
		makeTriangle(this.arrow, topbarheight, topbarheight, "down", { fill : '#000000' });
		this.expanded = true;
	}
};

ToolWidget.prototype.shrink = function(speed) {
	if (this.expanded) {
		$(this.container).animate({ height : topbarheight + 'px' }, speed);
		this.arrow.innerHTML = "";
		makeTriangle(this.arrow, topbarheight, topbarheight, "right", { fill : '#000000' });
		this.expanded = false;
	}
};

/*****
 * Object: ToolButton - define a clickable button
 *****
 *
 *****/
var ToolButton = function(reference, id, text, image, width, height) {
	// Make the container
	this.container = document.createElement("div");
	this.container.setAttribute("id", id);
	this.container.setAttribute("class", "toolbutton");
	reference.appendChild(this.container);
	
	var cstyle = window.getComputedStyle(this.container, null);
	var marginleft = parseInt(cstyle.marginLeft);
	var marginright = parseInt(cstyle.marginRight);
	var margintop = parseInt(cstyle.marginTop);
	var marginbottom = parseInt(cstyle.marginBottom);
	
	this.width = width - marginleft - marginright;
	this.height = height - margintop - marginbottom;
	
	this.container.style.width = this.width.toString() + 'px';
	this.container.style.height = this.height.toString() + 'px';
	this.container.style.display = 'block';
	
	// Square left side for the image
	var img = document.createElement("div");
	img.setAttribute("class", "image");
	img.style.width = this.height.toString() + 'px';
	img.style.height = this.height.toString() + 'px';
	img.style.display = 'block';
	img.style.float = 'left';
	img.appendChild(image);
	this.container.appendChild(img);
	
	// The right for the title
	var right = document.createElement("div");
	right.style.width = (this.width - this.height).toString() + 'px';
	right.style.height = this.height.toString();
	right.style.display = 'block';
	right.style.float = 'right';
	var span = document.createElement("span");
	span.setAttribute("class", "text");
	span.innerHTML = text;
	right.appendChild(span);
	this.container.appendChild(right);
	
	// Enable
	this.enabled = true;
	this.container.setAttribute("enabled", "true");
	this.container.setAttribute("clicked", "false");
	this.container.setAttribute("hovered", "false");
	
	// Callbacks
	this.mousedown = function() {};
	this.mouseup = function() {};
	
	var self = this;
	this.container.addEventListener("mousedown", function(e) {
		if (self.enabled) {
			self.mousedown(e);
			self.container.setAttribute("clicked", "true");
		}
	});
	
	this.container.addEventListener("mouseup", function(e) {
		if (self.enabled) {
			self.mouseup(e);
			self.container.setAttribute("clicked", "false");
		}
	});
	
	this.container.addEventListener("mouseenter", function(e) {
		self.container.setAttribute("hovered", "true");
	});
	
	this.container.addEventListener("mouseleave", function(e) {
		self.container.setAttribute("hovered", "false");
	});
};

ToolButton.prototype.enable = function() {
	if (!this.enabled) {
		this.enabled = true;
		this.container.setAttribute("enabled", "true");
	}
};

ToolButton.prototype.disable = function() {
	if (this.enabled) {
		this.enabled = false;
		this.container.setAttribute("enabled", "false");
	}
};

/*****
 * Object: ToolCheckbox - define a checkbox
 *****
 *
 *****/
ToolCheckbox = function(reference, id, text, imgchk, imgunchk, width, height) {
	this.chk = imgchk;
	this.unchk = imgunchk;
	
	// Make the container
	this.container = document.createElement("div");
	this.container.setAttribute("id", id);
	this.container.setAttribute("class", "toolcheckbox");
	reference.appendChild(this.container);
	
	var cstyle = window.getComputedStyle(this.container, null);
	var marginleft = parseInt(cstyle.marginLeft);
	var marginright = parseInt(cstyle.marginRight);
	var margintop = parseInt(cstyle.marginTop);
	var marginbottom = parseInt(cstyle.marginBottom);
	
	this.width = width - marginleft - marginright;
	this.height = height - margintop - marginbottom;
	
	this.container.style.width = this.width.toString() + 'px';
	this.container.style.height = this.height.toString() + 'px';
	this.container.style.display = 'block';
	
	// Square left side for the image
	this.box = document.createElement("div");
	this.box.setAttribute("class", "box");
	this.box.style.width = this.height.toString() + 'px';
	this.box.style.height = this.height.toString() + 'px';
	this.box.style.display = 'block';
	this.box.style.float = 'left';
	this.box.appendChild(this.unchk);
	this.container.appendChild(this.box);
	
	// The right for the title
	var right = document.createElement("div");
	right.style.width = (this.width - this.height).toString() + 'px';
	right.style.height = this.height.toString();
	right.style.display = 'block';
	right.style.float = 'right';
	var span = document.createElement("span");
	span.setAttribute("class", "text");
	span.innerHTML = text;
	right.appendChild(span);
	this.container.appendChild(right);
	
	// Enable
	this.enabled = true;
	this.checked = false;
	this.container.setAttribute("enabled", "true");
	this.container.setAttribute("clicked", "false");
	this.container.setAttribute("checked", "false");
	this.container.setAttribute("hovered", "false");
	
	// Callbacks
	this.statechange = function(state) {};
	
	var self = this;
	this.container.addEventListener("mousedown", function(e) {
		if (self.enabled) {
			self.container.setAttribute("clicked", "true");
		}
	});
	
	this.container.addEventListener("mouseup", function(e) {
		if (self.enabled) {
			self.checked = !self.checked;
			self.statechange(self.checked);
			self.container.setAttribute("clicked", "false");
			self.container.setAttribute("checked", (self.checked ? "true" : "false"));
			
			self.box.removeChild(self.checked ? self.unchk : self.chk);
			self.box.appendChild(self.checked ? self.chk : self.unchk);
		}
	});
	
	this.container.addEventListener("mouseenter", function(e) {
		self.container.setAttribute("hovered", "true");
	});
	
	this.container.addEventListener("mouseleave", function(e) {
		self.container.setAttribute("hovered", "false");
	});
}

ToolCheckbox.prototype.enable = function() {
	if (!this.enabled) {
		this.enabled = true;
		this.container.setAttribute("enabled", "true");
	}
};

ToolCheckbox.prototype.disable = function() {
	if (this.enabled) {
		this.enabled = false;
		this.container.setAttribute("enabled", "false");
	}
};

ToolCheckbox.prototype.check = function(c) {
	this.checked = c;
	this.statechange(this.checked);
	this.container.setAttribute("checked", (this.checked ? "true" : "false"));
}



