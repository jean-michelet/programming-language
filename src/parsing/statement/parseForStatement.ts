import { ForStatement, T } from "../grammar"
import SParser from "../SParser"
import { parseVariableDeclaration } from "./parseVariableDeclaration"

export function parseForStatement(parser: SParser): ForStatement {
    parser.consume(T.FOR)
    parser.consume(T.LEFT_PAREN)

    const expr1 = parser.isLookahead(T.SEMICOLON) ? null : (parser.isLookahead(T.LET) ? parseVariableDeclaration(parser) : parser.parseExpression())
    parser.consume(T.SEMICOLON)

    const expr2 = parser.isLookahead(T.SEMICOLON) ? null : parser.parseExpression()
    parser.consume(T.SEMICOLON)

    const expr3 = parser.isLookahead(T.RIGHT_PAREN) ? null : parser.parseExpression()

    parser.consume(T.RIGHT_PAREN)

    return [
      'for',
      expr1,
      expr2,
      expr3,
      parser.parseStatement()
    ]
  }