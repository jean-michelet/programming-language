import {
  AssignmentExpression,
  binaryop,
  BlockStatement,
  Expression,
  ForStatement,
  IteratorStatement,
  LambdaExpression,
  LeftHandSideExpression,
  PrimaryExpression,
  Program,
  Statement,
  StatementList,
  T,
  WhileStatement
} from './grammar'
import Lexer from './Lexer'
import Token from './Token'
import { parseAssignmentExpression } from './expression/parseAssignmentExpression'
import { parseIfStatement } from './statement/parseIfStatement'
import { parseLiteral, parseNumber } from './expression/parseLiteral'
import { parseVariableDeclaration } from './statement/parseVariableDeclaration'
import { parseWhileStatement } from './statement/parseWhileStatement'
import { parseForStatement } from './statement/parseForStatement'
import { parseClassDeclaration } from './statement/parseClassDeclaration'
import { parseFunctionDeclaration } from './statement/parseFunctionDeclaration'
import { parseCallExpression } from './expression/parseCallExpression'
import { isBinaryOperator } from './expression/parseBinaryExpr'

/**
 * S-expression parser of the programming language <language-name>
 *
 * _<method-name> are helper methods related to lookahead token
 */
export default class SParser {
  /**
   * the lexical analyzer
   */
  readonly _lexer: Lexer

  tokenMap: Token[] = []

  /**
   * Look-Behind token, the prev token retrieved from lexer
   */
  lookbehind: Token

  /**
   * Look-Alookahead token, the last token retrieved from lexer
   */
  lookahead?: Token

  iterationLevel: number = 0

  functionBodyLevel: number = 0

  constructor (lexer: Lexer) {
    this._lexer = lexer
  }

  public parse (src: string): Program {
    this._lexer.start(src)
    this.tokenMap = this._lexer.loadTokenMap()
    this.lookahead = this.tokenMap.shift()

    return ['program', this.parseStatementList()]
  }

  parseStatementList (): StatementList {
    const statement: Statement[] = []
    while (this.isLookaheadDefined() && !this.isLookahead(T.RIGHT_CBRACE)) {
      statement.push(this.parseStatement())
    }

    return statement
  }

  /**
   * Generate a statement
   */
  parseStatement (): Statement {
    // EmptyStatement
    if (this.isLookahead(T.SEMICOLON)) {
      this.consume(T.SEMICOLON)

      return []
    }

    // BlockStatement
    if (this.isLookahead(T.LEFT_CBRACE)) {
      return this.parseBlockStatement()
    }

    // VariableDeclaration
    if (this.isLookahead(T.LET) || this.isLookahead(T.CONST)) {
      const statement = parseVariableDeclaration(this)
      this.consume(T.SEMICOLON)
      return statement
    }

    // IfStatement
    if (this.isLookahead(T.IF)) {
      return parseIfStatement(this)
    }

    // WhileStatement
    if (this.isLookahead(T.WHILE) || this.isLookahead(T.FOR)) {
      this.iterationLevel += 1
      const iStmt: WhileStatement | ForStatement = this.isLookahead(T.WHILE) ? parseWhileStatement(this) : parseForStatement(this)
      this.iterationLevel -= 1

      return iStmt
    }

    // FunctionDeclaration
    if (this.isLookahead(T.FN)) {
      this.functionBodyLevel += 1
      const fnDeclaration = parseFunctionDeclaration(this)
      this.functionBodyLevel -= 1

      return fnDeclaration
    }

    if (this.isLookahead(T.RETURN)) {
      if (this.functionBodyLevel <= 0) {
        throw new SyntaxError(`'return' outside of function on line ${this.definedLookahead().line}`)
      }
    }

    // ReturnStatement
    if (this.isLookahead(T.RETURN)) {
      this.consume(T.RETURN)
      if (this.isLookahead(T.SEMICOLON) && this.consume(T.SEMICOLON) !== null) {
        return ['return', null]
      }

      const exp = this.parseExpression()
      this.consume(T.SEMICOLON)

      return ['return', exp]
    }

    // ThrowStatement
    if (this.isLookahead(T.THROW)) {
      this.consume(T.THROW)
      if (this.isLookahead(T.SEMICOLON) && this.consume(T.SEMICOLON) !== null) {
        return [{ line: this.lookbehind.line }, 'throw', null]
      }

      const exp = this.parseExpression()
      this.consume(T.SEMICOLON)

      return [{ line: this.lookbehind.line }, 'throw', exp]
    }

    // ClassDeclaration
    if (this.isLookahead(T.CLASS)) {
      return parseClassDeclaration(this)
    }

    // IteratorStatement
    if (this.isLookahead(T.BREAK) || this.isLookahead(T.CONTINUE)) {
      if (this.iterationLevel <= 0) {
        throw new SyntaxError(`Unsyntactic ${this.textLookahead()} Error on line ${this.definedLookahead().line}`)
      }

      const iStmt: IteratorStatement = [
        this.consume(this.typeLookahead()).text as 'break' | 'continue',
        null
      ]

      if (this.isLookahead(T.NUMBER)) {
        iStmt[1] = parseNumber(this)
      }

      this.consume(T.SEMICOLON)

      return iStmt
    }

    // Expression
    const statement = this.parseExpression()
    this.consume(T.SEMICOLON)
    return statement
  }

  parseBlockStatement (): BlockStatement {
    this.consume(T.LEFT_CBRACE)
    const statement: BlockStatement = ['begin', this.parseStatementList()]
    this.consume(T.RIGHT_CBRACE)

    return statement
  }

  parseExpression (): Expression {
    return parseAssignmentExpression(this)
  }

  parseLeftHandSideExpression (): LeftHandSideExpression {
    return parseCallExpression(this)
  }

  parseIdentifier (): string {
    return this.consume(T.IDENTIFIER).text
  }

  parsePrimarytoExpression (): PrimaryExpression {
    if (this.isLookaheadLiteral()) {
      return parseLiteral(this)
    }

    // UnaryExpression
    if (isBinaryOperator(this.typeLookahead())) {
      const operator = this.consume(this.typeLookahead()).text as binaryop

      return [operator, this.parseLeftHandSideExpression()]
    }

    // ParenthizedExpression
    if (this.isLookahead(T.LEFT_PAREN)) {
      this.consume(T.LEFT_PAREN)
      const expression = this.parseExpression()
      this.consume(T.RIGHT_PAREN)

      return expression
    }

    // ThisExpression
    if (this.isLookahead(T.THIS)) {
      this.consume(T.THIS)
      return 'this'
    }

    // NewExpression
    if (this.isLookahead(T.NEW)) {
      this.consume(T.NEW)
      return [
        'new',
        this.parseIdentifier(),
        this.argumentList()
      ]
    }

    // LambdaExpression
    if (this.isLookahead(T.FN)) {
      this.consume(T.FN)
      this.functionBodyLevel += 1

      const lambdaExp = [
        'lambda',
        this.argumentList(),
        this.parseStatement()
      ]

      this.functionBodyLevel -= 1

      return lambdaExp as LambdaExpression
    }

    return this.parseIdentifier()
  }

  argumentList (): AssignmentExpression[] {
    this.consume(T.LEFT_PAREN)

    const params: AssignmentExpression[] = []
    if (!this.isLookahead(T.RIGHT_PAREN)) {
      do {
        params.push(parseAssignmentExpression(this))
      } while (this.isLookahead(T.COMMA) && this.consume(T.COMMA) !== null)
    }

    this.consume(T.RIGHT_PAREN)

    return params
  }

  isLookaheadLiteral (): boolean {
    return [T.NUMBER, T.STRING, T.TRUE, T.FALSE, T.NULL].includes(this.typeLookahead())
  }

  /**
     * Check that a token is not null and the last retrieved from lexer
     * update _lookahead and _lookbehind
     */
  consume (expected: number): Token {
    const current = this.lookbehind = this.definedLookahead()
    if (current.type === null) {
      throw new SyntaxError('Unexpected end of file...')
    }

    if (expected !== current.type) {
      throw new SyntaxError(`Unexpected token "${current.text}", expected ${T[expected]} on line ${this.definedLookahead().line}`)
    }

    this.lookahead = this.tokenMap.shift()

    return this.lookbehind
  }

  /**
   * to avoid TypeScript warnings when _lookahead
   * token should never be null
   */
  definedLookahead (): Token {
    if (!this.isLookaheadDefined()) {
      throw new Error('Unexpected end of file...')
    }

    return this.lookahead as Token
  }

  tokenAt (pos: number): Token | null {
    if (typeof this.tokenMap[pos] === 'undefined') {
      return null
    }

    return this.tokenMap[pos]
  }

  isLookaheadDefined (): boolean {
    return this.lookahead instanceof Token
  }

  textLookahead (): string {
    return this.definedLookahead().text
  }

  typeLookahead (): number {
    return this.definedLookahead().type
  }

  isLookahead (tokenType: number): boolean {
    return this.typeLookahead() === tokenType
  }
}
