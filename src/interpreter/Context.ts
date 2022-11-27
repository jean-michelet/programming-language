interface record {
  [id: string]: any
}

/**
 * Execution environment
 */
export default class Context {
  protected _variables: record
  protected _constants: record
  public parent: Context | null

  constructor (variables: record = {}, constants: record = {}, parent: Context | null = null) {
    this._variables = variables
    this._constants = constants
    this.parent = parent
  }

  public get variables (): record {
    return this._variables
  }

  public get constants (): record {
    return this._constants
  }

  public declareVar (id: string, value: any): any {
    this.ensureDeclarable(id)
    this._variables[id] = value

    return value
  }

  public declareConst (id: string, value: any): any {
    this.ensureDeclarable(id)
    this._constants[id] = value

    return value
  }

  public isBlockScoped (id: string): boolean {
    return typeof this._variables[id] !== 'undefined' || typeof this._constants[id] !== 'undefined'
  }

  public assign (id: string, value: any): any {
    const env = this.resolveEnv(this, id)

    if (typeof env.constants[id] !== 'undefined') {
      throw new Error(`Invalid assignment to const "${id}"`)
    }

    env.variables[id] = value

    return value
  }

  public lookup (id: any): any {
    const env = this.resolveEnv(this, id)

    return env.isConst(id) ? env.constants[id] : env.variables[id]
  }

  public resolveEnv (env: Context, id: string): Context {
    while (Object.prototype.hasOwnProperty.call(env.variables, id) !== true && Object.prototype.hasOwnProperty.call(env.constants, id) !== true) {
      if (env.parent === null) {
        throw new ReferenceError(`"${id}" is not defined`)
      }

      env = env.parent
    }

    return env
  }

  private ensureDeclarable (id: string): void {
    if (this.isBlockScoped(id)) {
      throw new Error(`Cannot redeclare block-scoped "${id}"`)
    }
  }

  private isConst (id: string): boolean {
    return typeof this._constants[id] !== 'undefined'
  }
}
