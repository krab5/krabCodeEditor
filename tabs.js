/************************************************************
 * tabs.js - define and implements some tabs
 *
 * Tabs are just some divs in a greater div. Every tab have
 * the class "tab" which allow for easy styling !
 *
 * Whenever a tab is removed or selected, a function is called
 * (resp. tabremoved and tabchanged).
 *
 * The tabremoved is called BEFORE actually removing the tab
 * and shall return a boolean indicating whether or not the
 * tab can be removed.
 *
 * Every tab gets a attributed called "selected" which is
 * set to 'true' if the tab is selected and false if not.
 * This again allow for advanced styling.
 *
 * Author: 	Krab
 * Version:	0.9
 * 
 ************************************************************/
var arrowwidth = 30;

var Tabs = function(reference, height, tabwidth) {
	this.element = document.createElement("div");
	this.element.setAttribute('id', 'tabs');
	this.element.style.width = '100%';
	this.element.style.height = height + 'px';
	reference.appendChild(this.element);
	
	// Left and right arrows
	var self = this;
	
	this.leftArrow = document.createElement("div");
	this.leftArrow.setAttribute('id', 'leftarrow');
	this.leftArrow.style.width = arrowwidth.toString() + 'px';
	this.leftArrow.style.height = '100%';
	this.leftArrow.style.display = 'block';
	this.leftArrow.style.float = 'left';
	makeTriangle(this.leftArrow, arrowwidth, height, "left", { fill : '#000000' });
	this.element.appendChild(this.leftArrow);
	this.leftArrow.addEventListener('click', function(e) {
		e.preventDefault();
		self.shiftTabviewLeft();
		console.log("Shift left");
	});
	
	this.rightArrow = document.createElement("div");
	this.rightArrow.setAttribute('id', 'rightarrow');
	this.rightArrow.style.width = arrowwidth.toString() + 'px';
	this.rightArrow.style.height = '100%';
	this.rightArrow.style.display = 'block';
	this.rightArrow.style.float = 'right';
	makeTriangle(this.rightArrow, arrowwidth, height, "right", { fill : '#000000' });
	this.element.appendChild(this.rightArrow);
	this.rightArrow.addEventListener('click', function(e) {
		e.preventDefault();
		self.shiftTabviewRight();
		console.log("Shift right");
	});
	
	this.tabchanged = function(oldtab, newtab) {};
	this.tabremoved = function(tab) {};
	
	this.height = height;
	this.tabs = new Array();
	this.currentTab = -1;
	
	this.currentLeft = 0;
	this.tabwidth = tabwidth;
	this.maxtabs = Math.floor((this.element.offsetWidth - 2*arrowwidth) / this.tabwidth) - 1;
};

Tabs.prototype.addTab = function(num, text, focus) {
	var tab = document.createElement("div");
	
	if (num >= this.tabs.length) { // Trying to add a tab at the end
		this.element.insertBefore(tab, this.rightArrow);
	} else {
		this.element.insertBefore(tab, this.tabs[num]);
	}
	
	tab.setAttribute('id', 'tab' + num.toString());
	tab.setAttribute('class', 'tab');
	
	var cstyle = window.getComputedStyle(tab, null);
	var topmargin = parseInt(cstyle.marginTop);
	var bottommargin = parseInt(cstyle.marginBottom);
	
	tab.style.height = (this.height - topmargin - bottommargin).toString() + 'px';
	tab.style.width = this.tabwidth.toString() + 'px';
	tab.setAttribute('selected', 'false');
	tab.style.display = 'block';
	tab.style.float = 'left';
	tab.innerHTML = text;
	
	var self = this;
	tab.addEventListener('click', function(e) {
		e.preventDefault();
		var id = this.getAttribute('id');
		var t = id.substring(3, id.length);
		self.setCurrentTab(parseInt(t));
	});
	tab.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		var id = this.getAttribute('id');
		var t = id.substring(3, id.length);
		self.removeTab(parseInt(t));
	})
	
	this.tabs.splice(num, 0, tab);
	
	for (i = num; i < this.tabs.length; i++) {
		this.tabs[i].setAttribute('id', 'tab' + i.toString());
	}
	
	if (num >= this.currentLeft + this.maxtabs) {
		tab.style.display = 'none';
	} else if (num < this.currentLeft) {
		tab.style.display = 'none';
	} else {
		if (this.currentLeft + this.maxtabs < this.tabs.length) {
			this.tabs[this.currentLeft + this.maxtabs].style.display = 'none';
		}
	}
	
	if (focus) {
		this.setCurrentTab(num);
	}
};

Tabs.prototype.removeTab = function(num) {
	var self = this;
	var canremove = this.tabremoved(num);
	
	if (canremove) {
		$(this.tabs[num]).animate({ width : '0%' }, 400, 'swing', function() {
			self.element.removeChild(self.tabs[num]);
			self.tabs.splice(num, 1);
			for (i = num; i < self.tabs.length; i++) {
				self.tabs[i].setAttribute('id', 'tab' + i.toString());
			}
			
			if (self.currentLeft + self.maxtabs < self.tabs.length) {
				self.tabs[self.currentLeft + self.maxtabs - 1].style.display = 'block';
			} else if (self.currentLeft > 0) {
				self.currentLeft--;
				self.tabs[self.currentLeft].style.display = 'block';
			}
			
			if (num == self.currentTab) {
				if (num > 0) {
					self.setCurrentTab(num - 1);
				} else if (num < self.tabs.length) {
					self.setCurrentTab(num);
				} else {
					self.currentTab = -1;
				}
			}
		});
	}
};

Tabs.prototype.setCurrentTab = function(num) {
	if (this.currentTab >= 0 && this.currentTab < this.tabs.length) {
		this.tabs[this.currentTab].setAttribute('selected', 'false');
	}
	
	this.tabs[num].setAttribute('selected', 'true');
	var old = this.currentTab;
	this.currentTab = num;
	
	while (num < this.currentLeft) {
		//this.shiftTabviewLeft();
	}
	
	while (num > this.currentLeft + this.maxtabs) {
		//this.shiftTabviewRight();
	}
	
	this.tabchanged(old, num);
};

Tabs.prototype.getCurrentTab = function() {
	return this.currentTab >= 0 && this.currentTab < this.tabs.length ? this.tabs[this.currentTab] : null;
}

Tabs.prototype.shiftTabviewLeft = function() {
	if (this.currentLeft > 0) {
		this.tabs[this.currentLeft + this.maxtabs - 1].style.display = 'none';
		this.currentLeft--;
		this.tabs[this.currentLeft].style.display = 'block';
	}
}

Tabs.prototype.shiftTabviewRight = function() {
	if (this.currentLeft + this.maxtabs < this.tabs.length) {
		this.tabs[this.currentLeft].style.display = 'none';
		this.currentLeft++;
		this.tabs[this.currentLeft + this.maxtabs - 1].style.display = 'block';
	}
}

