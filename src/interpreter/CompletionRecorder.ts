import { Expression } from '../parsing/grammar'
import Context from './Context'

interface CompletionRecordInterface {
  _active: boolean
  _type?: string
  _rest?: [Expression, Context]
}

type completionStopper = ['break', 'continue', 'return', 'throw']

export default class CompletionRecorder {
  private _recordStack: CompletionRecordInterface[] = []

  public static availableCompletionStopper: completionStopper = [
    'break', 'continue', 'return', 'throw'
  ]

  public start (): void {
    this._recordStack.push({
      _active: false
    })
  }

  public current (): CompletionRecordInterface | null {
    if (this._recordStack.length > 0) {
      return this._recordStack[this._recordStack.length - 1]
    }

    return null
  }

  public continue (): void {
    this._recordStack[this._recordStack.length - 1] = { _active: false }
  }

  public isStopped (): boolean {
    if (this._recordStack.length > 0) {
      return this._recordStack[0]._active
    }

    return false
  }

  public stop (type: string, level: number = 1, rest?: [Expression, Context]): null {
    let index = this._recordStack.length - 1

    for (let i = 0; i < level; i++) {
      if (typeof this._recordStack[index] !== 'undefined') {
        this._recordStack[index] = { _active: true, _type: type, _rest: rest }

        index--
      }

      if (type === 'return') {
        break
      }
    }

    return null
  }

  public end (): CompletionRecordInterface {
    if (this._recordStack.length <= 0) {
      throw new Error('Impossible to end the completion record because CompletionRecorder.recordStack is empty.')
    }

    return this._recordStack.pop() as CompletionRecordInterface
  }
}
