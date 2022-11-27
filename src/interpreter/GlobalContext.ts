import Context from './Context'

export default class GlobalContext extends Context {
  constructor () {
    super()
    this._constants = {
      // booleans
      true: true,
      false: false,

      // nullable
      null: null,

      // arithmetic operators
      '+': (a: number, b: number): number => a + b,
      '-': (a: number, b: number): number => a - b,
      '*': (a: number, b: number): number => a * b,
      '/': (a: number, b: number): number => a / b,

      // comparison operators
      '>': (a: number, b: number): boolean => a > b,
      '<': (a: number, b: number): boolean => a < b,
      '>=': (a: number, b: number): boolean => a >= b,
      '<=': (a: number, b: number): boolean => a <= b,

      // equality operators
      '==': (a: any, b: any): boolean => a === b,
      '!=': (a: any, b: any): boolean => a !== b,

      // logical operators
      '&&': (a: boolean, b: boolean): boolean => a && b,
      '||': (a: boolean, b: boolean): boolean => a || b,

      // assignment operators
      '=': (a: any, b: any): any => {
        a = b

        return a
      },
      '+=': (a: number, b: number): number => {
        a += b

        return a
      },
      '-=': (a: number, b: number): number => {
        a -= b

        return a
      },
      '*=': (a: number, b: number): number => {
        a *= b

        return a
      },
      '/=': (a: number, b: number): number => {
        a /= b

        return a
      },

      /**
       * Built-in functions
       */
      log: (...args: any) => {
        console.log(...args)
        return args
      }
    }
  }
}
