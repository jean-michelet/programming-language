import { IfStatement, Statement, T } from "../grammar"
import SParser from "../SParser"

export function parseIfStatement (parser: SParser): IfStatement {
    // else if is an alternate if
    parser.consume(parser.isLookahead(T.ELSE_IF) ? T.ELSE_IF : T.IF)

    parser.consume(T.LEFT_PAREN)
    const test = parser.parseExpression()
    parser.consume(T.RIGHT_PAREN)

    const ifStatement: IfStatement = [
      'if',
      test,
      parser.parseStatement(),
      null
    ]

    let alternate: Statement | null = null
    while (parser.isLookaheadDefined() && parser.isLookahead(T.ELSE_IF)) {
      alternate = parseIfStatement(parser)
    }

    if (parser.isLookaheadDefined() && parser.isLookahead(T.ELSE)) {
      parser.consume(T.ELSE)

      ;(alternate != null) ? (alternate as IfStatement).push(parser.parseStatement()) : alternate = parser.parseStatement()
    }

    ifStatement.splice(-1, 1, alternate)

    return ifStatement
  }