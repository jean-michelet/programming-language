import { ClassBody, ClassDeclaration, T } from "../grammar"
import SParser from "../SParser"
import { parseFunctionDeclaration } from "./parseFunctionDeclaration"

export function  parseClassDeclaration (parser: SParser): ClassDeclaration {
    parser.consume(T.CLASS)

    const id = parser.parseIdentifier()

    let parent = null
    if (parser.isLookahead(T.EXTENDS)) {
      parser.consume(T.EXTENDS)
      parent = parser.parseIdentifier()
    }

    return [
      'class',
      id,
      parent,
      parseClassBody(parser)
    ]
  }

  export function parseClassBody (parser: SParser): ClassBody {
    parser.consume(T.LEFT_CBRACE)

    const body: ClassBody = ['begin', []]
    while (parser.isLookaheadDefined() && !parser.isLookahead(T.RIGHT_CBRACE)) {
      body[1].push(parseFunctionDeclaration(parser, 'method'))
    }

    parser.consume(T.RIGHT_CBRACE)

    return body
  }