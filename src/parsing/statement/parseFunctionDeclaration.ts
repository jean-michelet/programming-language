import { FunctionDeclaration, T } from "../grammar"
import SParser from "../SParser"

export function parseFunctionDeclaration (parser: SParser, kind: 'function' | 'method' = 'function'): FunctionDeclaration {
    parser.consume(T.FN)

    let isStatic = false
    if (parser.isLookahead(T.STATIC)) {
      isStatic = true
      parser.consume(T.STATIC)
    }

    return [
      { line: parser.lookbehind.line },
      'fn',
      parser.parseIdentifier(),
      kind,
      isStatic,
      parser.argumentList(),
      parser.parseBlockStatement()
    ]
  }