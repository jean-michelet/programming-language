import {
  AssignmentExpression,
  assignop,
  BinaryExpression,
  binaryop,
  BlockStatement,
  Expression,
  IfStatement,
  LambdaExpression,
  MemberExpression,
  VariableDeclaration,
  WhileStatement,
  ClassDeclaration,
  ClassBody,
  NewExpression,
  UnaryExpression
} from '../parsing/grammar'
import CompletionRecordStack from './CompletionRecorder'
import Context from './Context'
import GlobalContext from './GlobalContext'

/**
 * Environment based interpreter
 */
export default class Interpreter {
  _assignOperators = ['=', '+=', '-=', '*=', '/=']
  _mathOperators = ['+', '-', '*', '/']
  _comparisonOperators = ['>', '<', '>=', '<=', '==', '!=', '===', '!==']
  _logicalOperators = ['&&', '||']
  _parseInfo: number[] = []

  /**
     * when evaluation completion is stopped via break | continue | return | throw
     * We record the statement
     */
  _completionRecorder: CompletionRecordStack

  _stackTrace: string[] = []

  _output: string = ''

  private readonly _global: Context

  constructor () {
    this._global = new GlobalContext()
    this._completionRecorder = new CompletionRecordStack()
  }

  eval (ast: any, context: Context = this._global): any {
    if (this._output !== '') {
      return this._output
    }

    if (this._completionRecorder.isStopped()) {
      return null
    }

    if (typeof ast[0] === 'object' && 'line' in ast[0]) {
      this._parseInfo[ast[1] === 'fn' ? ast[2] : 'throw'] = ast[0].line

      ast.shift()
    }

    if (this.isNumber(ast)) {
      return ast
    }

    if (this.isString(ast)) {
      return ast.slice(1, -1)
    }

    if (this.isVariableAccess(ast)) {
      return context.lookup(ast)
    }

    /**
         * @throw SyntaxError if try to assign to const value
         */
    if (this.isAssignmentExpression(ast)) {
      return this.evalAssignment(ast, context)
    }

    if (this.isVariableDeclaration(ast)) {
      return this.evalVariableDeclaration(ast, context)
    }

    if (this.isBlockStatement(ast)) {
      return this.evalBlock(ast, new Context({}, {}, context))
    }

    if (this.isIfStatement(ast)) {
      return this.evalCondition(ast, context)
    }

    if (this.isWhileStatement(ast)) {
      return this.evalWhileLoop(ast, context)
    }

    if (this.isCallExpression(ast)) {
      return this.evalCallExpression(ast, context)
    }

    if (this.isLambdaExpression(ast)) {
      return this.evalLambdaExpression(ast, context)
    }

    if (this.isUnaryExpression(ast)) {
      return this.evalUnaryExpression(ast, context)
    }

    if (this.isBinaryExpression(ast)) {
      return this.evalBinaryExpression(ast, context)
    }

    if (this.isFunctionDeclaration(ast)) {
      return this.evalFunctionDeclaration(ast, context)
    }

    if (this.isClassDeclaration(ast)) {
      return this.evalClassDeclaration(ast, context)
    }

    if (this.isClassInstantiation(ast)) {
      return this.evalClassInstantiation(ast, context)
    }

    // is break | continue | return | throw
    if (this.needStopCompletionRecord(ast)) {
      if (this.isThrowStatement(ast)) {
        return this.buildOutput(ast[1], context)
      }

      if (this.isReturnStatement(ast)) {
        return this._completionRecorder.stop(ast[0], 1, [ast[1], context])
      }

      return this._completionRecorder.stop(ast[0], ast[1] ?? 1)
    }

    throw new Error('Invalid ast')
  }

  private buildOutput (exp: Expression, context: Context): string {
    this._output = `Error: ${String(this.eval(exp, context))} line ${this._parseInfo['throw' as any]}`

    this._stackTrace.forEach(fnName => {
      this._output += `\nat ${fnName} line ${this._parseInfo[fnName as any]}`
    })

    return this._output
  }

  // Evaluators
  private evalFunctionDeclaration (ast: any, context: Context): any {
    const [, id, kind, isStatic, params, body] = ast

    if (kind === 'method' && id === 'construct') {
      params.unshift('this')
    }

    const fn = {
      params: params,
      body: body,
      context: isStatic as boolean ? this._global : context // keep the environment (closure)
    }

    return context.declareConst(id, fn)
  }

  private evalLambdaExpression (ast: LambdaExpression, context: Context): object {
    const [, params, body] = ast

    return {
      params: params,
      body: body,
      context // keep the environment (closure)
    }
  }

  private evalUnaryExpression (ast: UnaryExpression, context: Context): any {
    const [op, a] = ast

    return this.evalBinaryExpression([op, 0, a], context)
  }

  private evalBinaryExpression (ast: [binaryop, BinaryExpression, BinaryExpression], context: Context): any {
    const [op, a, b] = ast
    const fn = context.lookup(op)

    return fn(this.eval(a, context), this.eval(b, context))
  }

  private evalCallExpression (ast: [name: 'callee', callee: MemberExpression | 'parent', args: AssignmentExpression[]], context: Context): string {
    const fn = this.eval(ast[1], context)

    if (this._stackTrace.length > 1000) {
      this._output = 'RangeError: Max call stack size exceeded'

      let prev: string = ''
      this._stackTrace.forEach((fnName, index) => {
        if (prev === fnName) {
          return
        }
        this._output += `\nat ${fnName} line ${this._parseInfo[fnName as any]}`

        prev = fnName
      })

      return this._output
    }

    const args = ast[2].map((arg: any) => this.eval(arg, context))

    // Built-in
    if (typeof fn === 'function') {
      return fn(...args)
    }

    return this._callUserDefinedFn(String(ast[1]), fn, args)
  }

  private _callUserDefinedFn (name: string, fn: any, args: any): any {
    this._stackTrace.push(name)
    this._completionRecorder.start()

    const activationRecord: {[name: string]: any} = {}
    fn.params.forEach((param: string, index: number) => { activationRecord[param] = args[index] })
    const activeEnv = new Context(activationRecord, {}, fn.context)

    let result = null
    for (const exp of fn.body[1]) {
      result = this.eval(exp, activeEnv)

      if (this._completionRecorder.isStopped()) {
        const [exp, context] = this._completionRecorder.current()?._rest as [Expression, Context]

        this._completionRecorder.end()

        return this.eval(exp, context)
      }
    }

    this._completionRecorder.end()

    this._stackTrace.pop()

    return result
  }

  private evalWhileLoop (ast: WhileStatement, context: Context): any {
    const [, test, body] = ast

    let result = null
    this._completionRecorder.start()
    while (this.eval(test, context) as boolean) {
      result = this.eval(body, context)

      if (this._completionRecorder.isStopped()) {
        const stopType = this._completionRecorder.current()?._type

        if (stopType === 'break') {
          break
        }

        if (stopType === 'continue') {
          this._completionRecorder.continue()
        }
      }
    }
    this._completionRecorder.end()

    return result
  }

  private evalVariableDeclaration (ast: VariableDeclaration, context: Context): Expression | undefined {
    let [kind, id, value] = ast
    value = this.eval(value, context)
    kind === 'const' ? context.declareConst(id, value) : context.declareVar(id, value)

    return value
  }

  private evalAssignment (ast: [op: assignop, id: string | MemberExpression, assign: any], context: Context): any {
    const [op, id, toAssign] = ast

    if (id[0] === 'member') {
      return this._evalClassMember(id as MemberExpression, context)
    }

    const fn = context.lookup(op)
    const variableValue = context.lookup(id)

    return context.assign(id as string, fn(variableValue, this.eval(toAssign, context)))
  }

  private evalCondition (ast: IfStatement, context: Context): null {
    const [, test, consequent, alternate] = ast

    if (this.eval(test, context) as boolean) {
      return this.eval(consequent, context)
    }

    if (alternate !== null) {
      return this.eval(alternate, context)
    }

    return null
  }

  private evalClassDeclaration (ast: ClassDeclaration, context: Context): any {
    const [, name, parent, body] = ast

    const parentEnv = parent !== null ? this.eval(parent, context) : context

    const classEnv = new Context({}, {}, parentEnv)

    this.evalBlock(body, classEnv)

    return context.declareVar(name, classEnv)
  }

  private evalClassInstantiation (ast: NewExpression, context: Context): any {
    const [, name, args] = ast

    const classEnv = this.eval(name, context)

    const instanceEnv = new Context({}, {}, classEnv)
    instanceEnv.declareConst('this', instanceEnv)

    const preparedArgs = args.map((arg: any) => this.eval(arg, context))

    return this._callUserDefinedFn(name, instanceEnv.lookup('construct'), [instanceEnv, ...preparedArgs])
  }

  private _evalClassMember (ast: MemberExpression, context: Context): any {
    const [, instance, name] = ast

    const instanceEnv = this.eval(instance, context)

    return instanceEnv.declareVar(name, context)
  }

  private evalBlock (block: BlockStatement | ClassBody, context: Context): Expression | null {
    let result = null

    block[1].forEach((ast: Expression) => {
      result = this.eval(ast, context)
    })

    return result
  }

  // Checkers

  private isClassMember (ast: any): boolean {
    return ast[0] === 'member'
  }

  private isClassInstantiation (ast: any): boolean {
    return ast[0] === 'new'
  }

  private isClassDeclaration (ast: any): boolean {
    return ast[0] === 'class'
  }

  private isReturnStatement (ast: any): boolean {
    return ast[0] === 'return'
  }

  private isThrowStatement (ast: any): boolean {
    return ast[0] === 'throw'
  }

  private isFunctionDeclaration (ast: any): boolean {
    return ast[0] === 'fn'
  }

  private isLambdaExpression (ast: any): boolean {
    return ast[0] === 'lambda'
  }

  private isCallExpression (ast: any): boolean {
    return ast[0] === 'callee'
  }

  private needStopCompletionRecord (ast: any): boolean {
    return CompletionRecordStack.availableCompletionStopper.includes(ast[0])
  }

  private isBreakOrContinueStatement (ast: any): boolean {
    return ast[0] === 'break' || ast[0] === 'continue'
  }

  private isWhileStatement (ast: any): boolean {
    return ast[0] === 'while'
  }

  private isIfStatement (ast: any): boolean {
    return ast[0] === 'if'
  }

  private isBlockStatement (ast: any): boolean {
    return ast[0] === 'begin' || ast[0] === 'program'
  }

  private isVariableAccess (ast: any): boolean {
    return typeof ast === 'string' && this.isIdentifier(ast)
  }

  private isVariableDeclaration (ast: any): boolean {
    return ast[0] === 'let' || ast[0] === 'const'
  }

  private isIdentifier (id: string): boolean {
    return /^(?!\d+)\w+/.test(id)
  }

  private isAssignmentExpression (ast: any): boolean {
    return this._assignOperators.includes(ast[0])
  }

  private isUnaryExpression (ast: any): boolean {
    return ['-', '+'].includes(ast[0]) && typeof ast[2] === 'undefined'
  }

  private isBinaryExpression (ast: any): boolean {
    return this._mathOperators.includes(ast[0]) || this._comparisonOperators.includes(ast[0]) || this._logicalOperators.includes(ast[0])
  }

  private isString (ast: any): boolean {
    return typeof ast === 'string' && ast[0] === "'" && ast.slice(-1) === "'"
  }

  private isNumber (ast: any): boolean {
    return typeof ast === 'number'
  }
}
