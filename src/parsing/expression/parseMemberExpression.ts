import { Literal, MemberExpression, T } from "../grammar"
import SParser from "../SParser"

export function parseMemberExpression (parser: SParser): MemberExpression {
    let obj: any = parser.parsePrimarytoExpression()

    while (parser.isLookahead(T.DOT) || parser.isLookahead(T.LEFT_BRACE)) {
      const type = parser.consume(parser.typeLookahead()).type
      let prop: Literal

      prop = parser.parseIdentifier()

      obj = [
        'member',
        obj,
        prop,
      ]
    }

    return obj
}