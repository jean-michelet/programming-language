/**
 * Test parser + interpeter
 *
 * In the book, parsing and interpretation will be tested at once
 * in order to simplify the content and because the book would be domain oriented
 */

import Interpreter from '../interpreter/Interpreter'
import createLexer from '../parsing/createLexer'
import SParser from '../parsing/SParser'

const assert = require('assert')

const parsingTests = [
  require('./parsing/programTest'),
  require('./parsing/literalTest'),
  require('./parsing/blockStatementTest'),
  require('./parsing/emptyStatementTest'),
  require('./parsing/mathTest'),
  require('./parsing/assignmentTest'),
  require('./parsing/variableDeclarationTest'),
  require('./parsing/ifStatementTest'),
  require('./parsing/relationalTest'),
  require('./parsing/equalityTest'),
  require('./parsing/logicalOperationTest'),
  require('./parsing/whileStatementTest'),
  require('./parsing/forStatementTest'),
  require('./parsing/iterationStatementTest'),
  require('./parsing/functionDeclarationTest'),
  require('./parsing/memberExpressionTest'),
  require('./parsing/callExpressionTest'),
  require('./parsing/classDeclarationTest')
]

const lexer = createLexer()
const parser = new SParser(lexer)

parsingTests.forEach((assertions) => {
  assertions.default.forEach((assertion: [src: string, expected: {} | Error]) => {
    const [src, expected] = assertion

    if (expected instanceof Error) {
      assert.throws(() => parser.parse(src), expected)
    } else {
      const ast = parser.parse(src)
      assert.deepEqual(JSON.stringify(ast), JSON.stringify(expected))
    }
  })
})

console.log('Test parsing OK')

const interpreterTests = [
  require('./interpreter/mathTest'),
  require('./interpreter/literalTest'),
  require('./interpreter/comparisonTest'),
  require('./interpreter/logicalTest'),
  require('./interpreter/variableTest'),
  require('./interpreter/conditionTest'),
  require('./interpreter/iterationTest'),
  require('./interpreter/functionTest'),
  require('./interpreter/completionRecordTest')
]

interpreterTests.forEach((assertions) => {
  assertions.default.forEach((assertion: [src: string, expected: any]) => {
    const [src, expected] = assertion

    const ast = parser.parse(src)
    const interpreter = new Interpreter()

    if (expected instanceof Error) {
      assert.throws(() => interpreter.eval(ast), expected)
    } else {
      assert.strictEqual(interpreter.eval(ast), expected)
    }
  })
})

console.log('Test evaluation OK')
