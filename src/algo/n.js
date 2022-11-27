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

export function parseBinaryExpression (parser: SParser, precedence: number): BinaryExpression {
    let left: BinaryExpression
    const next = parser.tokenAt(0)
    if (next === null || (!isBinaryOperator(next.type) && !isPrioritaryExpression(parser))) {
      left = parser.parseLeftHandSideExpression()
    } else {
      left = precedence < ops[next.text as precedenceOp] || (isPrioritaryExpression(parser) && precedence < MULTIPLICATIVE)
        ? parseBinaryExpression(parser, precedence + 1)
        : parser.parseLeftHandSideExpression()
    }

    // parser.isLookahead(tokenType)
    while (isOperatorPrecedence(parser, precedence)) {
      const operator = parser.consume(parser.typeLookahead()).text as precedenceOp
      left = [operator, left, parseBinaryExpression(parser, precedence + 1)]
    }

    return left
}

function isOperatorPrecedence(parser: SParser, precedence: number): boolean {
  return ops.hasOwnProperty(parser.textLookahead()) && ops[parser.textLookahead() as precedenceOp] === precedence
}

export function isPrioritaryExpression (parser: SParser): boolean {
    return isBinaryOperator(parser.typeLookahead()) || parser.typeLookahead() === T.LEFT_PAREN
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