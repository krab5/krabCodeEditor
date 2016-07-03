var CHighlighter = function() {
  var tk = {};
  // Types keywords
  tk['int'] = 'KEYWORD1';
  tk['double'] = 'KEYWORD1';
  tk['long'] = 'KEYWORD1';
  tk['double'] = 'KEYWORD1';
  tk['float'] = 'KEYWORD1';
  tk['char'] = 'KEYWORD1';
  tk['unsigned'] = 'KEYWORD1';
  tk['short'] = 'KEYWORD1';
  tk['void'] = 'KEYWORD1';
  tk['const'] = 'KEYWORD1';
  tk['auto'] = 'KEYWORD1';
  tk['register'] = 'KEYWORD1';
  tk['signed'] = 'KEYWORD1';
  tk['static'] = 'KEYWORD1';
  tk['volatile'] = 'KEYWORD1';

  // Ctrl structure keywords
  tk['break'] = 'KEYWORD2';
  tk['case'] = 'KEYWORD2';
  tk['continue'] = 'KEYWORD2';
  tk['default'] = 'KEYWORD2';
  tk['do'] = 'KEYWORD2';
  tk['else'] = 'KEYWORD2';
  tk['for'] = 'KEYWORD2';
  tk['goto'] = 'KEYWORD2';
  tk['if'] = 'KEYWORD2';
  tk['return'] = 'KEYWORD2';
  tk['switch'] = 'KEYWORD2';
  tk['while'] = 'KEYWORD2';

  // Typedef keywords
  tk['enum'] = 'KEYWORD3';
  tk['extern'] = 'KEYWORD3';
  tk['sizeof'] = 'KEYWORD3';
  tk['struct'] = 'KEYWORD3';
  tk['typedef'] = 'KEYWORD3';
  tk['union'] = 'KEYWORD3';

  // Separators
  tk[' '] = 'SEPARATOR0';
  tk[','] = 'SEPARATOR1';
  tk[';'] = 'SEPARATOR1';

  // Delimiters/separator symbols 
  tk['('] = 'SYMBOL1';
  tk[')'] = 'SYMBOL1';
  tk['['] = 'SYMBOL1';
  tk[']'] = 'SYMBOL1';
  tk['{'] = 'SYMBOL1';
  tk['}'] = 'SYMBOL1';
  tk['?'] = 'SYMBOL1';
  tk[':'] = 'SYMBOL1';

  // Arithmetical symbols
  tk['+'] = 'SYMBOL2';
  tk['-'] = 'SYMBOL2';
  tk['/'] = 'SYMBOL2';
  tk['*'] = 'SYMBOL2';
  tk['%'] = 'SYMBOL2';
  tk['='] = 'SYMBOL2';
  tk['!'] = 'SYMBOL2';
  tk['<'] = 'SYMBOL2';
  tk['>'] = 'SYMBOL2';

  // Logical operators
  tk['&'] = 'SYMBOL3';
  tk['|'] = 'SYMBOL3';
  tk['~'] = 'SYMBOL3';
  tk['^'] = 'SYMBOL3';

  var ns = ['.', 'b', 'x', 'f'];

  var sb = {};
  sb['"'] = 'STRING1';
  sb["'"] = 'STRING2';

  var se = {};
  se['"'] = 'STRING1';
  se["'"] = 'STRING2';

  var mb = {};
  mb["/**"] = 'MULTILINE1';
  mb["/*"] = 'MULTILINE2';

  var me = {};
  me["**/"] = 'MULTILINE1';
  me["*/"] = 'MULTILINE2';

  var sl = {};
  sl["///"] = 'SINGLELINE1';
  sl["//"] = 'SINGLELINE2';
  sl["#"] = 'SINGLELINE3';

  this.hl = new Highlighter({
    token : tk,
    numspec : ns,
    strbegin : sb,
    strend : se,
    mlbegin : mb,
    mlend : me,
    singleline : sl
  });

  var self = this;
  this.Highlight = function(input) {
    return self.hl.Highlight(input);
  };
}


