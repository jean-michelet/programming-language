let tokenMap: any[] = []

const LOGICAL_OR = 1
const LOGICAL_AND = 2
const COMPARISON = 3
const ADDITIVE = 4
const MULTIPLICATIVE = 5

const opPrecedence = {
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

  '&&': LOGICAL_AND,

  '||': LOGICAL_OR
}

const tests = [
  [
    [1],
    1
  ],
  [
    // 2 + 3 - 5
    [2, '+', 3, '-', 5],
    ['-', ['+', 2, 3], 5]
  ],
  [
    // 1 + 2 * 3
    [1, '+', 2, '*', 3],
    ['+', 1, ['*', 2, 3]]
  ],
  [
    // (1 + 2) * 3
    ['(', 1, '+', 2, ')', '*', 3],
    ['*', ['+', 1, 2], 3]
  ],
  [
    // 1 + 2 * 3 / 4
    [1, '+', 2, '*', 3, '/', 4],
    ['+', 1, ['/', ['*', 2, 3], 4]]
  ],
  [
    // - 1 + 2
    ['-', 1, '+', 2],
    ['+', ['-', 1], 2]
  ],
  [
    // 1 != 1 == 2
    [1, '!=', 1, '==', 2],
    ['==', ['!=', 1, 1], 2]
  ],
  [
    // 1 + 2 > 3 && 4 / 5 || 6 > 7
    [1, '+', 2, '>', 3, '&&', 4, '/', 5, '||', 6, '>', 7],
    [
      '||',
      [
        '&&',
        ['>', ['+', 1, 2], 3],
        ['/', 4, 5]
      ],
      ['>', 6, 7]
    ]
  ]
]

// tests.forEach((test: any) => {
//   tokenMap = test[0]
//   console.log(`Test passed: ${JSON.stringify(parseBinaryExpression()) === JSON.stringify(test[1])}`)
// })

// You can work here:
tokenMap = [2,'/',89,'+',17,'*',90,'-',3,'+',7,'/',1,'-',4,'+',89,'*',3,'+',1,'+',9,'-',47,'-',9,'+',2,'-',37,'*',9,'+',0,'/',21,'+',8,'-',9,'-',2,'/',4]
console.time('parse');
parseBinaryExpression()
console.timeEnd('parse');
// console.log(parseBinaryExpression());

function parseBinaryExpression (precedence: number = 1): any {
  const next: string = tokenMap[1]
  if (!next || (!isOperator(next) && !isPrimaryExpression())) {
    return nextToken()
  }

  let left = precedence < opPrecedence[next] || (isPrimaryExpression() && precedence < MULTIPLICATIVE)
    ? parseBinaryExpression(precedence + 1)
    : parsePrimaryExpression()

  while (isOperator(tokenMap[0]) && precedence === opPrecedence[tokenMap[0]]) {
    const operator = nextToken()
    left = [operator, left, parseBinaryExpression(precedence + 1)]
  }

  return left
}

function nextToken (token = null) {
  if (tokenMap.length <= 0) {
    return null
  }

  if (!isTokenValid(tokenMap[0])) {
    throw new Error(`Invalid token "${tokenMap[0]}".`)
  }

  if (token && token !== tokenMap[0]) {
    throw new Error(`Unexpected token "${tokenMap[0]}", expected "${token}".`)
  }

  return tokenMap.shift()
}

function parsePrimaryExpression (): any {
  // Literal
  if (typeof tokenMap[0] === 'number') {
    return nextToken()
  }

  // UnaryExpression
  if (isOperator(tokenMap[0])) {
    return [nextToken(), parsePrimaryExpression()]
  }

  // ParenthesizedExpression
  if (tokenMap[0] === '(') {
    nextToken('(')
    const value = parseBinaryExpression()
    nextToken(')')

    return value
  }

  throw new Error('Invalid expression.')
}

function isTokenValid (token: string) {
  return typeof token === 'number' ||
      ['(', ')'].includes(token) ||
      isOperator(token)
}

function isPrimaryExpression () {
  return isOperator(tokenMap[0]) || tokenMap[0] === '('
}

function isOperator (token: string) {
  return typeof opPrecedence[token] !== 'undefined'
}
