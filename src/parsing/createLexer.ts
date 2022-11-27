
import { T } from './grammar'
import Lexer from './Lexer'

export default function createLexer (): Lexer {
  const lexer: Lexer = new Lexer()

  // ignored
  lexer.addSkipToken(T.WHITE_SPACE, /^\s+/)
  lexer.addSkipToken(T.SINGLE_LINE_COMMENT, /^\/\/.*/)
  lexer.addSkipToken(T.MULTIPLE_LINE_COMMENT, /^\/\*[\s\S]*?\*\//)

  lexer

    // keyword tokens
    .addToken(T.LET, /^\blet\b/)
    .addToken(T.CONST, /^\bconst\b/)
    .addToken(T.IF, /^\bif\b/)
    .addToken(T.ELSE_IF, /^\belse if\b/)
    .addToken(T.ELSE, /^\belse\b/)
    .addToken(T.TRUE, /^\btrue\b/)
    .addToken(T.FALSE, /^\bfalse\b/)
    .addToken(T.NULL, /^\bnull\b/)
    .addToken(T.WHILE, /^\bwhile\b/)
    .addToken(T.FOR, /^\bfor\b/)
    .addToken(T.BREAK, /^\bbreak\b/)
    .addToken(T.CONTINUE, /^\bcontinue\b/)
    .addToken(T.THROW, /^\bthrow\b/)
    .addToken(T.FN, /^\bfn\b/)
    .addToken(T.RETURN, /^\breturn\b/)
    .addToken(T.CLASS, /^\bclass\b/)
    .addToken(T.EXTENDS, /^\bextends\b/)
    .addToken(T.PARENT, /^\bparent\b/)
    .addToken(T.NEW, /^\bnew\b/)
    .addToken(T.THIS, /^\bthis\b/)
    .addToken(T.STATIC, /^\bstatic\b/)

    // numbers
    .addToken(T.NUMBER, /^\d+/)

    // identifiers
    .addToken(T.IDENTIFIER, /^(?!\d+)\w+/)

    // delimiters
    .addToken(T.DOT, /^\./)
    .addToken(T.SEMICOLON, /^;/)
    .addToken(T.LEFT_BRACE, /^\[/)
    .addToken(T.RIGHT_BRACE, /^\]/)
    .addToken(T.LEFT_CBRACE, /^{/)
    .addToken(T.RIGHT_CBRACE, /^}/)
    .addToken(T.LEFT_PAREN, /^\(/)
    .addToken(T.RIGHT_PAREN, /^\)/)
    .addToken(T.COMMA, /^,/)

    // operators
    .addToken(T.EQUALITY, /^[=!]?[=!]=/)
    .addToken(T.ASSIGN, /^=/)
    .addToken(T.COMBINED_ASSIGN, /^[+\-*/]=/)
    .addToken(T.ADDITIVE, /^[+-]/)
    .addToken(T.MULTIPLICATIVE, /^[*/]/)
    .addToken(T.LOGICAL_AND, /^&&/)
    .addToken(T.LOGICAL_OR, /^\|\|/)
    .addToken(T.LOGICAL_NOT, /^!/)
    .addToken(T.RELATIONAL, /^[><]=?/)

    // strings
    .addToken(T.STRING, /^'[^'.]*'/)
    .addToken(T.STRING, /^"[^".]*"/)

  return lexer
}
