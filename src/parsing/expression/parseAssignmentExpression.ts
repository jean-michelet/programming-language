import { AssignmentExpression, assignop, T } from "../grammar"
import SParser from "../SParser"
import { parseBinaryExpression } from "./parseBinaryExpr"

export function parseAssignmentExpression (parser: SParser): AssignmentExpression {
    const left = parseBinaryExpression(parser)

    if (!isLookaheadAssignmentOperator(parser)) {
      // due to circular reference beetwen
      return left as AssignmentExpression
    }

    // left (this.lookbehind) in an assignment expression must always be a identifier
    if (parser.lookbehind.type !== T.IDENTIFIER) {
      throw new SyntaxError('Invalid left-hand side assignment')
    }

    return [assignmentOperator(parser), left as string, parseAssignmentExpression(parser)]
}

export function isLookaheadAssignmentOperator (parser: SParser): boolean {
  return parser.isLookahead(T.ASSIGN) || parser.isLookahead(T.COMBINED_ASSIGN)
}

export function assignmentOperator (parser: SParser): assignop {
  return parser.consume(parser.isLookahead(T.ASSIGN) ? T.ASSIGN : T.COMBINED_ASSIGN).text as assignop
}