import { BinaryExpression, binaryop, logicalop, T } from "../grammar"
import SParser from "../SParser"

export const LOGICAL_OR = 1
export const LOGICAL_AND = 2
export const COMPARISON = 3
export const ADDITIVE = 4
export const MULTIPLICATIVE = 5

type precedenceOp = logicalop | '+' | '-' | '*' | '/' | '>' | '<' | '>=' | '<=' | '==' | '!=' | '===' | '!=='

export const ops = {
  '*': MULTIPLICATIVE,
  '/': MULTIPLICATIVE,

  '+': ADDITIVE,
  '-': ADDITIVE,

  '>': COMPARISON,
  '<': COMPARISON,
  '>=': COMPARISON,
  '<=': COMPARISON,
  '==': COMPARISON,
  '!=': COMPARISON,
  '!==': COMPARISON,
  '===': COMPARISON,

  '&&': LOGICAL_AND,

  '||': LOGICAL_OR
}

export function parseBinaryExpression (parser: SParser, precedence: number = LOGICAL_OR): BinaryExpression {
    const next = parser.tokenAt(0)
    if (next === null || (!isBinaryOperator(next.type) && !isLookaheadPrioritary(parser))) {
      return parser.parseLeftHandSideExpression()
    } 

    let left: BinaryExpression
    if (ops.hasOwnProperty(next.text) && precedence < ops[next.text as precedenceOp] 
      || 
      isLookaheadPrioritary(parser) && precedence < MULTIPLICATIVE
    ) {
      left = parseBinaryExpression(parser, precedence + 1)
    } else {
      left = parser.parseLeftHandSideExpression()
    }

    while (isOperatorPrecedence(parser, precedence)) {
      const operator = parser.consume(parser.typeLookahead()).text as precedenceOp
      left = [operator, left, parseBinaryExpression(parser, precedence + 1)]
    }

    return left
}

function isOperatorPrecedence(parser: SParser, precedence: number): boolean {
  return ops.hasOwnProperty(parser.textLookahead()) && ops[parser.textLookahead() as precedenceOp] === precedence
}

export function isLookaheadPrioritary (parser: SParser): boolean {
    return isBinaryOperator(parser.typeLookahead()) || parser.isLookahead(T.LEFT_PAREN)
}

export function isBinaryOperator(opType: number): boolean {
    switch (opType) {
      case T.LOGICAL_OR:
      case T.LOGICAL_AND:
      case T.EQUALITY:
      case T.RELATIONAL:
      case T.ADDITIVE:
      case T.MULTIPLICATIVE:
        return true
    }

    return false
}