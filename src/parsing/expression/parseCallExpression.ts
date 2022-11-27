import { CallExpression, T } from "../grammar"
import SParser from "../SParser"
import { parseMemberExpression } from "./parseMemberExpression"

export function parseCallExpression (parser: SParser): CallExpression {
    // parent call
    if (parser.isLookahead(T.PARENT)) {
      parser.consume(T.PARENT)
      return [
        'callee',
        'parent',
        parser.argumentList()
      ]
    }

    let member: CallExpression = parseMemberExpression(parser)

    if (parser.isLookahead(T.LEFT_PAREN)) {
      member = [
        'callee',
        member,
        parser.argumentList()
      ]
    }

    return member
  }