export default class Token {
  line: number
  private _type: number
  private _regex: RegExp
  private _text: string = ''
  private readonly _toSkip: boolean

  constructor (type: number, regex: RegExp, toSkip: boolean = false) {
    this._type = type
    this._regex = regex
    this._toSkip = toSkip
  }

  public get type (): number {
    return this._type
  }

  public set type (type: number) {
    this._type = type
  }

  public get regex (): RegExp {
    return this._regex
  }

  public set regex (regex: RegExp) {
    this._regex = regex
  }

  public get text (): string {
    return this._text
  }

  public set text (text: string) {
    this._text = text
  }

  public skippable (): boolean {
    return this._toSkip
  }
}
