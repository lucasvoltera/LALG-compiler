export const tokens = {
  OPEN_COMMENT:/({)/,
  CLOSE_COMMENT:/(})/,
  COMMENT_LINE: /([/]{2}[^]*)/,
  ASSIGN: /(:=)/,
  DOT: /(\.)/,
  NUM: /[0-9]{1,8}/,
  FLOAT: /[0-9]{1,8}\.[0-9]{1,5}/,
  FALSE: /(false)/,
  TRUE: /(true)/,
  SUM: /[+]/,
  MINUS: /[-]/,
  MULTIPLY: /[*]/,
  DIVIDE: /[/]/,
  IDENTIFIER: /([_]*[a-zA-Z0-9_]{1,15})/,
  OPEN_PARENTHESIS: /[(]/,
  CLOSE_PARENTHESIS: /[)]/,
  COLON: /(:)/,
  COMMA: /(,)/,
  SEMICOLON: /(;)/,
  EQUAL: /(=)/,
  SMALLER: /(<)/,
  BIGGER: /(>)/,
  DIFFERENT: /(<>)/,
  SMALLER_OR_EQUAL: /(<=)/,
  BIGGER_OR_EQUAL: /(>=)/,
  WHITESPACE: /\s/
}