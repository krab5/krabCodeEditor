/*************************************************************
 * self.js - define a code editor
 *************************************************************
 * This code editor is in fact a div containing a list of div
 * that are its lines.
 *
 * We redirect the keyevents so that the code editor has the
 * "right" behaviour (cf keyHandler).
 *************************************************************
 * Author: Krab
 *************************************************************/

// Global variables
var lineheight = 18;    // Force lines height (in px)
var numwidth = 50;
var padding = 10;
var inpad = 7;
var self = null;  // The code editor

var charwidth = 15;

/*****
 * Object Line : define a line of the code editor
 *****
 * A line is mostly a div of class line of id line<line number>
 * It also contains a number that identifies it.
 *****/

/* Idea : two child of code editor (code and line numbers)
 * you set overflow of the first to 'scroll' and the one of the
 * second to 'hidden'. Whenever you scroll code, you use
 * scrollTop to scroll the second.
 */
var Line = function(prt, num, focus, reference, after, before, width) {
  // The line number
  var linenb =document.createElement("div");
  linenb.setAttribute("class", "linenumber");
  linenb.style.width = numwidth.toString() + 'px';
  linenb.style.height = '100%';
  linenb.style.display = 'inline';
  linenb.style.float = 'left';
  linenb.style.textAlign = 'right';
  linenb.style.paddingRight = inpad + 'px';

  linenb.innerHTML = (num+1).toString();

  // The editable line
  var line = document.createElement("div");
  line.setAttribute("id", "line" + num.toString()); 
  line.style.width = (width - numwidth - padding - inpad).toString() + 'px';
  //line.style.height = lineheight.toString() + 'px';
  line.style.height = '100%';
  line.style.display = 'inline'; 
  line.style.float = 'right';
  line.style.overflow = 'hidden';

  // The whole line
  var theline = document.createElement("div");
  theline.appendChild(linenb);
  theline.appendChild(line);
  theline.setAttribute("class", "line");
  theline.style.height = lineheight.toString() + 'px';
  theline.style.width = width.toString() + 'px';
  theline.style.display = 'block';

  if (reference !== null) {
    if (after !== null) {
      insertAfter(reference, theline, after);
    } else if (before !== null) {
      reference.insertBefore(theline, before);
    } else {
      reference.appendChild(theline);
    }
  }

  if (focus) {
    line.setAttribute("contenteditable", "true");
    line.focus();
  }

  this.element = line;
  this.num = num;
  this.linenb = linenb;
  this.toplevel = theline;
  this.saved = true;

  /*****
   * mouseHandler - handler for the mouse events.
   *****
   * Added to any new line created, it is called when we click on a line.
   * At this moment, the current new line is set to match the clicked
   * line. As this handler comes first, the cursor is set to the
   * right position !
   *****/
  this.element.addEventListener("mousedown", function() {
    var textid = this.getAttribute('id');
    var id = parseInt(textid.substring(4, textid.length));

    if (id !== prt.currentline) {
      prt.setCurrentLine(id);
    }
  });

};

/*****
 * setWidth - set the width of the line
 *****
 * This function is here to manage overflow events
 *****/
Line.prototype.setWidth = function(width) {
  this.toplevel.style.width = width.toString() + 'px';
  this.element.style.width = (width - numwidth - padding - inpad).toString() + 'px';
};

/*****
 * getCursorPos - get the actual carret position of the line
 *****
 * This code is by Tim Down (cf StackOverflow)
 *****/
Line.prototype.getCursorPos = function() {
  var caretOffset = 0;
  var doc = this.element.ownerDocument || this.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(this.element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ( (sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
};

/*****
 * setCursorPos - set the current position of the carret
 *****
 *
 *****/
Line.prototype.setCursorPos = function(pos) {
  var node = this.element.firstChild;
  var range = document.createRange();
  var sel  = window.getSelection();
  range.setStart(node, pos);
  range.setEnd(node, pos);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
};

/*****
 * setEditable - make the div of the line editable
 *****
 * This function turns the "contenteditable" attribute of the
 * line to true or false. If ed == true, the we also enfocus
 * the line
 *****/
Line.prototype.setEditable = function(ed) {
  this.element.setAttribute("contenteditable", ed.toString());
  if (ed) {
    this.element.focus();
  }
};

/*****
 * isEditable - determine if the div of the line is editable
 *****
 *
 *****/
Line.prototype.isEditable = function() {
  return this.element.getAttribute("contenteditable") == "true" ? true : false;
};

/*****
 * setLineNumber - set the actual number of the line
 *****
 * It is important to use this function an not only "line.num = ..."
 * because the line number is present in num but also int the id
 * of the div !
 *****/
Line.prototype.setLineNumber = function(n) {
  this.num = n;
  this.element.setAttribute("id", "line" + n.toString());
  this.linenb.innerHTML = (n+1).toString();
};

/*****
 * getEndPos - get the position of the end of line
 *****
 *
 *****/
Line.prototype.getEndPos = function() {
  return this.element.textContent.length;
};

/*****
 * atEnd - determine if the cursor is at the end of line
 *****
 *
 *****/
Line.prototype.atEnd = function() {
  return (this.getEndPos() == this.getCursorPos());
};

/*****
 * atStart - determine if the cursor is at the beginning
 * of the line
 *****
 *
 *****/
Line.prototype.atStart = function() {
  return (this.getCursorPos() == 0);
};


/*****
 * Auxiliary function that allow to insert 'after' a node (and note
 * before)
 *****/
function insertAfter(reference, newitem, existing) {
  if (existing.nextSibling === null) {
    reference.appendChild(newitem);
  } else {
    reference.insertBefore(newitem, existing.nextSibling);
  }
}

/*****
 * Object CodeEditor: define an editable widget that allow you to
 * write code.
 *****
 * A CodeEditor is essentially a list of lines and functions to
 * manipulate them, with a guarentee of the integrity of the
 * structure (consistency of the line numbers, for instance).
 *****/
var CodeEditor = function(codeID, width, height, linewidth) {
  this.element = document.getElementById(codeID);
  this.lines = new Array();
  this.numline = 0;
  this.currentline = 0;

  this.element.style.width = width.toString() + 'px';
  this.element.style.height = height.toString() + 'px';
  this.element.style.overflow = 'scroll';
  this.element.scrollLeft = 0;

  this.autoindent = "";

  this.linewidth = linewidth || width;

  /*
   * This is the handler called whenever the current line is changed.
   * Two parameters are used here : the old line and the new one.
   */
  this.linechange = function(oldline, newline) {};

  /*****
   * keyHandler - handle a key event
   *****
   * This function shall be passed to the keypress event of your
   * code editor.
   *
   * It overrides some keys when it is needed :
   *  - The enter key create a new line and insert it after the
   *  current line (re-numering every lines below)
   *  - The up key, when not on the first line, change the current
   *  line to the one just before
   *  - The down key does the same for the line just after
   *  - The back key, when at the beginning of a line (if not
   *  the first), will remove this line, add its content to the
   *  previous one and set it as the current
   *  - The suppr key does the same thing except it works when at
   *  the end of the line
   *  - The right and left arrow change line when needed...
   *****/
  var self = this;
  this.element.addEventListener('keypress', function(e) {
    switch(e.key) {
      case "Enter": //Enter
        e.preventDefault();

        // Count the number of spaces at the beginning of the line (for auto indenting)
        var l = self.getCurrentLine().element.innerHTML;
        var i = 0;
        self.autoindent = "";
        while (l.substr(i, 6) === "&nbsp;" || l.substr(i, 1) === " ") {
          i+=6;
          self.autoindent += "&nbsp;";
        }
        
        self.addLine(self.currentline + 1, true);
        self.getCurrentLine().saved = false;
        break;
      case "ArrowUp": //Up
        e.preventDefault();
        if (self.currentline > 0) {
          //e.preventDefault();

          var pos = self.getCurrentLine().getCursorPos();
          self.setCurrentLine(self.currentline - 1);
          self.getCurrentLine().setCursorPos(Math.min(pos, self.getCurrentLine().getEndPos()));
        }
        break;
      case "ArrowDown": //Down
        e.preventDefault();
        if (self.currentline + 1 < self.numline) {

          var pos = self.getCurrentLine().getCursorPos();
          self.setCurrentLine(self.currentline + 1);
          self.getCurrentLine().setCursorPos(Math.min(pos, self.getCurrentLine().getEndPos()));
        }
        break;
      case "Backspace": //Back
        if (self.getCurrentLine().atStart() && self.currentline > 0) {
          e.preventDefault();

          var text = self.getCurrentLine().element.innerHTML;
          var endofline = self.lines[self.currentline-1].getEndPos();

          self.removeLine(self.currentline);
          self.setCurrentLine(self.currentline-1);
          self.getCurrentLine().element.innerHTML += text;
          self.getCurrentLine().setCursorPos(endofline);
          self.getCurrentLine().saved = false;
        }
        break;
      case "Delete": //Suppr
        if (self.getCurrentLine().atEnd() && self.currentline < self.numline) {
          e.preventDefault();

          var text = self.lines[self.currentline+1].element.innerHTML;
          var endofline = self.getCurrentLine().getEndPos();

          self.removeLine(self.currentline + 1);
          self.getCurrentLine().element.innerHTML += text;
          self.getCurrentLine().setCursorPos(endofline);
          self.getCurrentLine().saved = false;
        }
        break;
      case "ArrowRight": //Right
        //e.preventDefault();
        if (self.getCurrentLine().atEnd() && self.currentline + 1 < self.numline) {
          e.preventDefault();
          self.setCurrentLine(self.currentline + 1);
        }
        break;
      case "ArrowLeft": //Left
        //e.preventDefault();
        if (self.getCurrentLine().atStart() && self.currentline > 0) {
          e.preventDefault();
          self.setCurrentLine(self.currentline - 1);
          self.getCurrentLine().setCursorPos(self.getCurrentLine().getEndPos());
        }
        break;
      case "Tab": //Tab
        e.preventDefault();
        var pos = self.getCurrentLine().getCursorPos();
        var ct = self.getCurrentLine().element.innerHTML;
        var newtext = ct.substring(0, pos) + "&nbsp;&nbsp;&nbsp;&nbsp;" + ct.substring(pos, ct.length);
        self.getCurrentLine().element.innerHTML = newtext;
        self.getCurrentLine().setCursorPos(pos+4);
        self.getCurrentLine().saved = false;
        break;
      default:
        self.getCurrentLine().saved = false;
        //nop
    }
  });
};

/*****
 * removeLine - remove the line number 'num' of the editor,
 * updating every line number
 *****
 *
 *****/
CodeEditor.prototype.removeLine = function(num) {
  var line = this.lines[num];
  this.element.removeChild(line.toplevel);

  this.lines.splice(this.lines.indexOf(line), 1);
  this.numline--;

  for (i = num; i < this.numline; i++) {
    this.lines[i].setLineNumber(i);
  }
};

/*****
 * addLine - add a line so that its number is 'num', update
 * every line number and focus it if wanted.
 *****
 *
 *****/
CodeEditor.prototype.addLine = function(num, focus) {
  var cl;

  if (focus) {
    cl = this.currentline;
    this.lines[this.currentline].setEditable(false);
    this.currentline = num;
  }

  var line;
  if (num < this.numline)
    line = new Line(this, num, focus, this.element, this.lines[num-1].toplevel, null, this.linewidth);
  else
    line = new Line(this, num, focus, this.element, null, null, this.linewidth);

  this.lines.splice(num, 0, line);
  this.numline++;

  for (i = num; i < this.numline; i++) {
    this.lines[i].setLineNumber(i);
  }

  if (this.autoindent.length > 0) {
    line.element.innerHTML = this.autoindent;
    line.setCursorPos(this.autoindent.length / 6);
  }

  if (focus) { this.linechange(cl, num); }
};

/*****
 * setCurrentLine - set the current line : unfocus the old one,
 * change the currentline attribute and make focus it
 *****
 *
 *****/
CodeEditor.prototype.setCurrentLine = function(num) {
  var cl = this.currentline;

  if (this.currentline < this.numline && this.lines[this.currentline].isEditable()) {
    this.lines[this.currentline].setEditable(false);
  }
  this.lines[num].setEditable(true);
  this.currentline = num;

  this.linechange(cl, num);
};

/*****
 * getCurrentLine - get the object Line corresponding to the
 * current line
 *****
 *
 *****/
CodeEditor.prototype.getCurrentLine = function() {
  return this.lines[this.currentline];
};

/*****
 * getContent - return the content of one line with no HTML
 *****
 *
 *****/
CodeEditor.prototype.getContent = function(line) {
  return this.lines[line].element.textContent;
};

/*****
 * setContent - set the content of one line
 *****
 *
 *****/
CodeEditor.prototype.setContent = function(line, ct) {
  this.lines[line].element.innerHTML = ct;
};

CodeEditor.prototype.clear = function() {
  var lns = this.lines.length;
  for (var i = 0; i < lns; i++) {
    this.removeLine(0);
  }
};

/*****
 * save - save the unsaved lines using a remote cgi script
 *****
 * the script must understant the params "file", "line" and "ct" so that
 * <script>?file=<file>&line=<line>&ct=<content> means "save the line <line>
 * in the file <file> which has the content <content>". If the script
 * sucessully saved the line, it shall send back "ok" (if not, the response
 * text is directly errlogged).
 *****/
CodeEditor.prototype.save = function(script, file, progress, sending) {
  var content = "";
  if (progress === undefined) progress = function(progress) {};
  if (sending === undefined) sending = function(xhreq) {};

  for (var i = 0; i < this.lines.length; i++) {
    progress(i / this.lines.length);
    content += this.lines[i].element.textContent + "\n";
  }

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() { sending(xhr); };
  xhr.open("POST", script, true);
  xhr.setRequestHeader("Content-type", "text/plain");
  xhr.send("file:" + file + "&content:" + btoa(content));
};

CodeEditor.prototype.load = function(script, file, progress, sending, textprocess) {
  if (progress === undefined) progress = function(progress) {};
  if (sending === undefined) sending = function(xhreq) {};
  if (textprocess === undefined) textprocess = function(text) { return text; };

  var self = this;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    sending(xhr);
    if (xhr.readyState == 4 && xhr.status == 200) {
      self.clear();
      var resp = xhr.responseText.split('!');
      console.log("Response: " + resp[1]);
      var content = atob(resp[0]);
      var lns = content.split('\n');
      for (var i = 0; i < lns.length; i++) {
        progress(i / lns.length);
        self.addLine(i, false);
        self.lines[i].element.innerHTML = textprocess(lns[i]);
      }
    }
  };
  xhr.open("GET", script + "?file=" + file, true);
  xhr.send();
};


/*****
 * linechangeHandler - handler for when we change of line
 *****
 *
 *****/
/*function linechangeHandler(oldline, newline) {
  var content = self.lines[oldline].element.innerHTML;

  $.ajax({
  url : 'cgi-bin/highlights.pl',
  async : true,
  data : { input : content, refresh : true },
  success : function(data, stat, xhr) {
  console.log("AJAX request ended : " + stat);
  self.lines[oldline].element.innerHTML = data;
  }, error : function(xhr, stat, err) {
  console.error("AJAX request ended with eror " + stat + " (" + err + ")");
  }
  });
  }

  $(function() { 
  console.log("Ready !");
  self = new CodeEditor("self", 500, 300);
  self.addLine(0, false);
  self.getCurrentLine().setEditable(true); 
  self.linechange = linechangeHandler;
  });*/


