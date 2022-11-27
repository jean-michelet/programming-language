import { parseAssignmentExpression } from "../expression/parseAssignmentExpression"
import { AssignmentExpression, T, VariableDeclaration } from "../grammar"
import SParser from "../SParser"

export function parseVariableDeclaration (parser: SParser): VariableDeclaration {
    const kind = parser.consume(parser.typeLookahead()).type
    const id = parser.parseIdentifier()
    let init: AssignmentExpression | undefined

    if (!parser.isLookahead(T.SEMICOLON)) {
      parser.consume(T.ASSIGN)
      init = parseAssignmentExpression(parser)
    } else if (kind === T.CONST) {
      throw new SyntaxError('const declaration must be initialized')
    }

    return [
      kind === T.CONST ? 'const' : 'let',
      id,
      init
    ]
}