import Token from './Token'

export default class Lexer {
  private _src: string = ''
  private _line: number = 1
  private _tokenMap: Token[] = []

  private readonly _availableTokens: Token[] = []

  public loadTokenMap (): Token[] {
    let token = this.nextToken() as Token
    while (token !== undefined) {
      this._tokenMap.push(token)
      token = this.nextToken() as Token
    }

    return this._tokenMap
  }

  public nextToken (): Token | undefined {
    if (this._src.length <= 0) {
      return
    }

    for (const token of this._availableTokens) {
      const match: RegExpExecArray | null = token.regex.exec(this.src)

      if (match === null) {
        continue
      }

      this._line += match[0].split('\n').length - 1
      this.src = this._src.slice(match[0].length, this._src.length)

      if (token.skippable()) {
        return this.nextToken()
      }

      const newToken = new Token(token.type, token.regex, false)
      newToken.text = match[0]
      newToken.line = this.line

      return newToken
    }

    throw new SyntaxError(`Unexpected token "${this._src[0]}" on line ${this._line}`)
  }

  public start (src: string): void {
    this.reset(src)
  }

  public reset (src: string): void {
    this._src = src
    this._line = 1
    this._tokenMap = []
  }

  public get src (): string {
    return this._src
  }

  public set src (src: string) {
    this._src = src
  }

  public get line (): number {
    return this._line
  }

  public set line (line: number) {
    this._line = line
  }

  public addToken (type: number, regex: RegExp): this {
    this._availableTokens.push(new Token(type, regex))

    return this
  }

  public addSkipToken (type: number, regex: RegExp): this {
    this._availableTokens.push(new Token(type, regex, true))

    return this
  }
}
