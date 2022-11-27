import { T, WhileStatement } from "../grammar"
import SParser from "../SParser"

export function parseWhileStatement(parser: SParser): WhileStatement {
    parser.consume(T.WHILE)

    parser.consume(T.LEFT_PAREN)
    const expr = parser.parseExpression()
    parser.consume(T.RIGHT_PAREN)

    return [
      'while',
      expr,
      parser.parseStatement()
    ]
  }