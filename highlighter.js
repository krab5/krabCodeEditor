// Some constants
/*var HTMLTAG = -1;
var 'NONE' = 0;
var KEYWORD1 = 1;
var KEYWORD2 = 2;
var KEYWORD3 = 3;
var KEYWORD4 = 4;
var SEPARATOR0 = 10;
var SEPARATOR1 = 11;
var SEPARATOR2 = 12;
var NUMBER = 20;
var STRING1 = 30;
var STRING2 = 31;
var STRING3 = 32;
var STRING4 = 33;
var SYMBOL1 = 40;
var SYMBOL2 = 41;
var SYMBOL3 = 42;
var SINGLELINE1 =  50;
var SINGLELINE2 = 51;
var SINGLELINE3 = 52;
var SINGLELINE4 = 53;
var MULTILINE1 = 60;
var MULTILINE2 = 61;
var MULTILINE3 = 62;
var MULTILINE4 = 63;
var MULTILINE5 = 64;
var VARIABLE1 = 70;
var VARIABLE2 = 71;
var VARIABLE3 = 72;
var VARIABLE4 = 73;*/

// Styles
var token_style  = {};
token_style['KEYWORD1']    = 'keyword1';
token_style['KEYWORD2']    = 'keyword2';
token_style['KEYWORD3']    = 'keyword3';
token_style['KEYWORD4']    = 'keyword4';
token_style['SEPARATOR1']  = 'separator1';
token_style['SEPARATOR2']  = 'separator2';
token_style['NUMBER']      = 'number';
token_style['STRING1']     = 'string1';
token_style['STRING2']     = 'string2';
token_style['STRING3']     = 'string3';
token_style['STRING4']     = 'string4';
token_style['SYMBOL1']     = 'symbol1';
token_style['SYMBOL2']     = 'symbol2';
token_style['SYMBOL3']     = 'symbol3';
token_style['SINGLELINE1'] = 'singleline1';
token_style['SINGLELINE2'] = 'singleline2';
token_style['SINGLELINE3'] = 'singleline3';
token_style['SINGLELINE4'] = 'singleline4';
token_style['MULTILINE1']  = 'multiline1';
token_style['MULTILINE2']  = 'multiline2';
token_style['MULTILINE3']  = 'multiline3';
token_style['MULTILINE4']  = 'multiline4';
token_style['MULTILINE5']  = 'multiline5';
token_style['VARIABLE1']   = 'variable1';
token_style['VARIABLE2']   = 'variable2';
token_style['VARIABLE3']   = 'variable3';
token_style['VARIABLE4']   = 'variable4';

// Some options
var sep_token = ['SEPARATOR0', 'SEPARATOR1', 'SEPARATOR2'];
var sym_token = ['SYMBOL1', 'SYMBOL2', 'SYMBOL3'];

var html_conv = {};
html_conv['&amp;'] = '&';
html_conv['&gt;'] = '>';
html_conv['&lt;'] = '<';
html_conv['&nbsp;'] = ' ';

var spanclass_re = /<span class="([^"]*)">/;

var Highlighter = function(spec, url) {
  if (spec !== undefined)
    this.setSpec(spec);
  else if (url !== undefined) {
    this.setSpecFromURL(url);
  }
};

// HTML tags
function HTMLTag(tag, data, out, lastsep) {
  console.warn("Wrong HTMLTag function called ! tag:" + tag);
}
Highlighter.prototype.HTMLTag = function(tag, data, out, lastsep) {
  if (tag.charAt(1) === '/')
    data['html'] = 'off';
  else
    data['html'] = 'on';

  if (tag.substr(0, 11) === "<span class")
    data['spanclass'] = spanclass_re.exec(tag)[1];

  if (tag === "</span>")
    data['spanclass'] = 'none';

  //console.log("HTMLTag : " + tag);
  return (out + lastsep + tag);
}

function getKeyFromValue(hash, value) {
  for (var key in hash) {
    if (hash[key] === value)
      return key;
  }

  return undefined;
}

// Function that detect if the current character is possibly the beginning of a token
// in the set of token passed in the argument
// Returns the token type
function tokenbegin(tokenset, input, i, where) {
  if (where === undefined) where = function(a,b){ return true; };
  for (var key in tokenset) {
    if (i + key.length <= input.length) {
      if (input.substr(i, key.length) === key && where(key, tokenset[key])) {
        return tokenset[key];
      }
    }
  }

  return 'NONE';
}

// Tokens
function TokenFound(type, content, data, out, lastsep) {
  console.warn("The wrong TokenFound function has been called ! type=" + type + ",content=" + content);
}

Highlighter.prototype.TokenFound = function(type, content, data, out, lastsep) {
  var output = "";

  if (getKeyFromValue(html_conv, content) !== undefined) {
    content = getKeyFromValue(html_conv, content);
  }

  if (data['html'] === 'on' && data['spanclass'] !== 'none') {
    output = content;
  } else {
    content = this.tf(content, type);

    if (token_style[type] !== undefined)
      output = "<span class=\"" + this.styleprefix + token_style[type] + "\">" + content + "</span>";
    else
      output = content;
  }

  //console.log("type:" + type + ",content:" + content + ",ls:'" + lastsep + "'");
  return (out + lastsep + output);
}

Highlighter.prototype.setSpec = function(spec) {
  this.token       = spec['token'];
  this.numspec     = spec['numspec'] === undefined ? ['.'] : spec['numspec'];
  this.strbegin    = spec['strbegin'];
  this.strend      = spec['strend'];
  this.mlbegin     = spec['mlbegin'];
  this.mlend       = spec['mlend'];
  this.singleline  = spec['singleline'];
  this.variables   = spec['variables'];
  this.tf          = spec['callback'] === undefined ? function(a,b) { return a; } : spec['callback'];
  this.styleprefix = spec['styleprefix'] === undefined ? "" : spec['styleprefix'];
  this.context     = spec['context'] === undefined ? "" : spec['context'];
  this.contextdata = spec['contextdata'] === undefined ? {} : spec['contextdata'];

  this.token[' '] = 'SEPARATOR0';
};

Highlighter.prototype.setSpecFromURL = function(url) {
  var xhr = new XMLHttpRequest();
  var self = this;

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        console.log("Request sucessful ! " + xhr.statusText);
        try {
          var obj = JSON.parse(xhr.responseText);
          self.setSpec(obj);
        } catch(err) {
          console.error("Syntax error : " + err.message);
          console.log(xhr.responseText);
        }
      } else {
        alert('Error ' + xhr.status + ': ' + xhr.statusText);
      }
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
};

// Main function
Highlighter.prototype.Highlight = function(input) {
  // Variables
  var output = "";
  var ct = "";
  var ct_type = 'NONE';
  var data = {}; data['html'] = 'off'; data['spanclass'] = 'none';

  // Tokenizer 9000
  var i = 0;
  var lastsep = "";

  if (this.context === "multiline") {
    var mlendlen = this.contextdata['corrmlendlength'];
    var mlct = "";
    while (i + mlendlen <= input.length && (input.substr(i, mlendlen) !== this.contextdata['corrmlend'])) {
      mlct = mlct + input.charAt(i);
      i++;
    }

    mlct = mlct + input.substr(i, mlendlen);
    output = this.TokenFound(this.contextdata['mltype'], mlct, data, output, lastsep);

    if (input.substr(i, mlendlen) === this.contextdata['corrmlend']) {
      this.context = "";
      this.contextdata = {};
    }

    i += mlendlen;
  }

  while (i < input.length) {
    var c  = input.charAt(i);

    // Filtering out html tags
    if (c === '<') {
      if (ct.length > 0) {
        output = this.TokenFound(ct_type, ct, data, output, lastsep);
        lastsep = "";
      }

      var htmltag = "";
      while (input.charAt(i) !== '>') {
        htmltag = htmltag + input.charAt(i);
        i++;
      }
      htmltag = htmltag + input.charAt(i);

      output = this.HTMLTag(htmltag, data, output, lastsep);

      i++;
      lastsep = '';
      ct_type = 'NONE';
      ct = '';

      continue;
    }
    
    // HTML Entity
    if (c === '&') {
      var htmlsym = '';
      while (input.charAt(i) !== ';') {
        htmlsym = htmlsym + input.charAt(i);
        i++;
      }
      htmlsym = htmlsym + input.charAt(i);

      //HTMLSymbol(htmlsym, data);
     
      if (html_conv[htmlsym] !== undefined)
        c = html_conv[htmlsym];
      else
        ct = ct + htmlsym;
    }

    // Detecting the starting of a multiline
    if ((ttype = tokenbegin(this.mlbegin, input, i)) !== 'NONE') {
      if (ct.length > 0) {
        output = this.TokenFound(ct_type, ct, data, output, lastsep);
        ct = '';
        ct_type = 'NONE';
        lastsep = '';
      }

      this.context = "multiline";
      this.contextdata = {};
      this.contextdata['corrmlend'] = getKeyFromValue(this.mlend, ttype);
      var mlendlen = this.contextdata['corrmlend'].length;
      this.contextdata['corrmlendlength'] = mlendlen;
      this.contextdata['mltype'] = ttype;

      var mlct = c;
      i++;

      while (i + mlendlen <= input.length && (input.substr(i, mlendlen) !== this.contextdata['corrmlend'])) {
        mlct = mlct + input.charAt(i);
        i++;
      }

      mlct = mlct + input.substr(i, mlendlen);

      output = this.TokenFound(this.contextdata['mltype'], mlct, data, output, lastsep);

      if (input.substr(i, mlendlen) === this.contextdata['corrmlend']) {
        this.context = "";
        this.contextdata = {};
      }

      i += mlendlen - 1;
    }
    // Detecting strings (or other single line delimited token)
    else if ((ttype = tokenbegin(this.strbegin, input, i)) !== 'NONE') {
      if (ct.length > 0) {
        output = this.TokenFound(ct_type, ct, data, output, lastsep);
        lastsep = '';
      }

      var string = c;
      var corrstrend = getKeyFromValue(this.strend, ttype);
      var strendlen = corrstrend.length;
      i++;

      while (i + strendlen <= input.length && input.substr(i, strendlen) !== corrstrend) {
        if (input.charAt(i) === "\\") {
          string = string + input.substr(i, 2);
          i += 2;
        } else {
          string = string + input.charAt(i);
          i++;
        }
      }

      string = string + input.substr(i, strendlen);

      output = this.TokenFound(ttype, string, data, output, lastsep);
      i += strendlen - 1;
      lastsep = '';
      ct = '';
      ct_type = 'NONE';
    }
    // Left delimited single line token (e.g. comments in C++, preproc in C, ...)
    else if ((ttype = tokenbegin(this.singleline, input, i)) !== 'NONE') {
      if (ct.length > 0) {
        output = this.TokenFound(ct_type, ct, data, output, lastsep);
        lastsep = '';
      }

      var comct = '';
      while (i < input.length) {
        comct = comct + input.charAt(i);
        i++;
      }

      output = this.TokenFound(ttype, comct, data, output, lastsep);
      lastsep = '';
    }
    // Left delimited single word token (e.g. variables in Perl...)
    else if ((ttype = tokenbegin(this.variables, input, i)) !== 'NONE') {
      if (ct.length > 0) {
        output = this.TokenFound(ct_type, ct, data, output, lastsep);
        lastsep = '';
      }

      ct_type = ttype;
      ct = this.variables[ttype];
      i += ct.length - 1;
    }
    // Digits
    else if (/^\d$/.test(c)) {
      if (ct.length === 0) {
        ct_type = 'NUMBER';
      }

      ct = ct + c;
    } else if (this.numspec.indexOf(c) > -1) {
      ct = ct + c;
    }
    // Separators
    else if (((ttype = this.token[c]) !== undefined) && (sep_token.indexOf(ttype) > -1)) {
      if (ct.length > 0) {
        output = this.TokenFound(ct_type, ct, data, output, lastsep);
        lastsep = '';
        ct = '';
        ct_type = 'NONE';
      }

      output = this.TokenFound(ttype, c, data, output, lastsep);
      lastsep = '';
    }
    // Symbols
    else if (this.token[c] !== undefined && sym_token.indexOf(this.token[c]) > -1) {
      if (ct.length > 0) {
        output = this.TokenFound(ct_type, ct, data, output, lastsep);
        lastsep = '';
      }

      output = this.TokenFound(this.token[c], c, data, output, lastsep);
      ct = '';
      lastsep = '';
      ct_type = 'NONE';
    }
    // Any other symbol
    else {
      var found = false;

      if (ct === '') {
        for (var key in this.token) {
          if (c === key.charAt(0)) {
            var tok = '';
            var j = i;
            while (j < input.length && tok.length < key.length && tokenbegin(this.token, input, j, function(key,value) { return (sep_token.indexOf(value) > -1); }) === 'NONE') {
              tok = tok + input.charAt(j);
              j++;
            }

            if (tok === key) {
              output = this.TokenFound(this.token[key], tok, data, output, lastsep);
              lastsep = '';
              ct = '';
              ct_type = 'NONE';
              i = j - 1;
              found = true;
              break;
            }
          }
        }

        // This ain't a token !
        if (found === false) {
          ct = c;
          ct_type = 'NONE';
        }
      } else {
        ct = ct + c;
      }
    }

    i++;
  }

  if (ct.length > 0) {
    output = this.TokenFound(ct_type, ct, data, output, lastsep);
    lastsep = '';
  }

  return output;
}


