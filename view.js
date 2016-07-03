/*****
 * Object: CodeArea - define an area where we put code
 *****
 * A code area mostly contains some code editors defined by codeEditor.js
 * This object is mainly here to provide some useful function : new,
 * load, save, etc. and for interfacing the code area with the tabs one.
 *****/
var CodeArea = function(reference, height) {
	this.element = document.createElement("div");
	this.element.setAttribute('id', 'codeArea');
	this.element.style.width = '100%';
	this.element.style.height = height + 'px';
	reference.appendChild(this.element);
	
	this.height = height;
	
	this.codes = new Array();
	this.currentCode = -1;
}

CodeArea.prototype.addCode = function(num, focus) {
	var code = document.createElement("div"); // set up code editor
	//var code = document.createElement("textarea");
	code.setAttribute('id', 'code' + num.toString());
	code.setAttribute('class', 'code');
	code.style.width = '100%';
	code.style.height = '100%';
	code.style.display = 'none';
	
	var codeEditor = new CodeEditor(code);
	
	this.element.appendChild(code);
	this.codes.splice(num, 0, code);
	
	for (i = num; i < this.codes.length; i++) {
		this.codes[i].setAttribute('id', 'code' + i.toString());
	}
	
	if (focus) {
		this.setCurrentCode(num);
	}
}

CodeArea.prototype.removeCode = function(num) {
	this.element.removeChild(this.codes[num]);
	this.codes.splice(num, 1);
	
	for (i = num; i < this.codes.length; i++) {
		this.codes[i].setAttribute('id', 'code' + i.toString());
	}
}

CodeArea.prototype.setCurrentCode = function(num) {
	if (this.currentCode >= 0 && this.currentCode < this.codes.length) {
		this.codes[this.currentCode].style.display = 'none';
	}
	
	this.codes[num].style.display = 'block';
	this.codes[num].focus();
	//var old = this.currentCode;
	this.currentCode = num;
}

CodeArea.prototype.load = function(num, content) {
	
}

/*****
 * Object: View - define a view with several parts
 *****
 * The View object is defined as three main areas : left, middle and right.
 * The middle area is actually a ruler to set the left and right size.
 *
 * The left area contains three smaller areas : the tabs, the code area
 * and the status bar.
 *
 * The right one contains several little windows/widgets that are intended
 * to be some toolboxes.
 *****/
var middlewidth = 5;

var View = function(cont, width, height) {
	this.width = width;
	this.height = height;
	
	// Init the container
	this.container = document.getElementById(cont);
	this.container.style.width = this.width.toString() + 'px';
	this.container.style.height = this.height.toString() + 'px';
	this.container.style.backgroundColor = '#909090';
	
	// Create the left part
	var leftwidth = Math.floor(0.80 * this.width);
	this.left = document.createElement("div");
	this.left.setAttribute('id', 'left');
	this.left.style.width = leftwidth.toString() + 'px';
	this.left.style.height = this.height.toString() + 'px';
	this.left.style.display = 'block';
	this.left.style.float = 'left';
	this.container.appendChild(this.left);
	
	// Create the right part
	this.right = document.createElement("div");
	this.right.setAttribute('id', 'right');
	this.right.style.width = (this.width - middlewidth - leftwidth).toString() + 'px';
	//this.right.style.width = 'auto';
	this.right.style.height = this.height.toString() + 'px';
	this.right.style.display = 'block';
	this.right.style.float = 'right';
	//this.right.style.overflow = 'scroll';
	this.container.appendChild(this.right);
	
	var img1 = document.createElement("span");
	img1.innerHTML = "T";
	var img2 = document.createElement("span");
	img2.innerHTML = "T";
	var img3 = document.createElement("span");
	img3.innerHTML = "X";
	var img4 = document.createElement("span");
	img4.innerHTML = " ";
	
	var toolbox1 = new ToolWidget(this.right, "test", "Test", (this.width - middlewidth - leftwidth), 200);
	var toolbox2 = new ToolWidget(this.right, "test2", "Test 2", (this.width - middlewidth - leftwidth), 300);
	var butt1 = new ToolButton(toolbox1.content, "btest1", "Button 1", img1, (this.width - middlewidth - leftwidth - 20), 50); 
	var butt2 = new ToolButton(toolbox2.content, "btest2", "Button 2", img2, (this.width - middlewidth - leftwidth - 20), 50);
	var chk1 = new ToolCheckbox(toolbox1.content, "ctest1", "Checkbox", img3, img4, (this.width - middlewidth - leftwidth - 20), 50);
	butt2.disable();
	
	// Create the middle part
	this.middle = document.createElement("div");
	this.middle.setAttribute('id', 'middle');
	this.middle.style.width = middlewidth.toString() + 'px';
	this.middle.style.height = this.height.toString() + 'px';
	this.middle.style.margin = '0px';
	this.container.appendChild(this.middle);
	
	// Create the tabs area
	this.tabs = new Tabs(this.left, 30, 100);
	this.tabs.addTab(0, "Test0", true);
	this.tabs.addTab(1, "Test1", false);
	this.tabs.addTab(2, "Test2", false);
	this.tabs.addTab(3, "Test3", false);
	this.tabs.addTab(4, "Test4", false);
	this.tabs.addTab(5, "Test5", false);
	this.tabs.addTab(6, "Test6", false);
	this.tabs.addTab(7, "Test7", false);
	this.tabs.addTab(8, "Test8", false);
	this.tabs.addTab(9, "Test9", false);
	this.tabs.addTab(10, "Test10", false);
	this.tabs.addTab(11, "Test11", false);
	this.tabs.addTab(12, "Test12", false);
	
	this.codeArea = new CodeArea(this.left, this.height - 30 - 30);
	/*this.codeArea.addCode(0, true);
	this.codeArea.addCode(1, false);
	this.codeArea.addCode(2, false);*/
	//this.tabs.setCurrentTab(1);
	
	var self = this;
	/*this.tabs.tabremoved = function(num) {
		self.codeArea.removeCode(num);
	};
	this.tabs.tabchanged = function(oldt, newt) {
		self.codeArea.setCurrentCode(newt);
	};*/
};

