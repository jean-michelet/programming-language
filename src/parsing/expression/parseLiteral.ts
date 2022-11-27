import { Literal, T } from "../grammar"
import SParser from "../SParser"

export function parseLiteral (parser: SParser, pure: boolean = false): Literal {
  switch (parser.typeLookahead()) {
    case T.STRING:
      return parseString(parser, pure)
    case T.NUMBER:
      return parseNumber(parser)
    case T.TRUE:
    case T.FALSE:
    case T.NULL:
      return parser.consume(parser.definedLookahead().type).text
    default:
      throw new Error(`Unexpected Literal token "${parser.textLookahead()}"`)
  }
}

export function parseString (parser: SParser, pure: boolean = false): string {
  const str = parser.consume(parser.definedLookahead().type).text.slice(1, -1)

  return pure ? str : `'${str}'`
}

export function parseNumber (parser: SParser): number {
  return Number(parser.consume(parser.definedLookahead().type).text)
}