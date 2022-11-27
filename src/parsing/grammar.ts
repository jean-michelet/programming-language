export enum T {
  // skippable
  WHITE_SPACE,
  SINGLE_LINE_COMMENT,
  MULTIPLE_LINE_COMMENT,

  // literals
  NUMBER,
  STRING,
  IDENTIFIER,

  // delimiters
  SEMICOLON,
  LEFT_BRACE,
  RIGHT_BRACE,
  LEFT_CBRACE,
  RIGHT_CBRACE,
  LEFT_PAREN,
  RIGHT_PAREN,
  COMMA,
  DOT,

  // logical operators
  LOGICAL_OR,
  LOGICAL_AND,
  LOGICAL_NOT,

  // math operators
  EQUALITY,
  RELATIONAL,
  ADDITIVE,
  MULTIPLICATIVE,

  // assignment operators
  ASSIGN,
  COMBINED_ASSIGN,

  // keywords
  LET,
  CONST,
  TRUE,
  FALSE,
  NULL,
  IF,
  ELSE,
  ELSE_IF,
  WHILE,
  FOR,
  BREAK,
  CONTINUE,
  THROW,
  FN,
  RETURN,
  CLASS,
  EXTENDS,
  PARENT,
  NEW,
  THIS,
  STATIC,

  EOL,
  EOF,
}

/**
 * @link https://www.webopedia.com/definitions/program/
 * A program is a set of instructions that a computer uses to perform a specific function
 */
export type Program = ['program', StatementList]

export type StatementList = Statement[]

/**
  * @link https://www.webopedia.com/definitions/statement/
  * A statement is an instruction written in a high-level language. A statement directs the computer
  * to perform a specified action.
  */
export type Statement =
   ExpressionStatement
   | BlockStatement
   | EmptyStatement
   | VariableDeclaration
   | FunctionDeclaration
   | IfStatement
   | WhileStatement
   | ForStatement
   | IteratorStatement
   | ReturnStatement
   | ThrowStatement
   | ClassDeclaration

export type ExpressionStatement = Expression

export type BlockStatement = ['begin', StatementList]

export type EmptyStatement = []

export type VariableDeclaration = [
   kind: string,
   id: Identifier,
   assign?: Expression,
]

export type FunctionDeclaration = [
   parseInfo: ParseInfo,
   name: 'fn',
   id: Identifier,
   kind: 'function' | 'method',
   isStatic: boolean,
   params: Expression[],
   body: Statement
]

export type IfStatement = [
   name: 'if',
   test: Expression,
   statement: Statement,
   alternate: IfStatement | Statement | null,
]

export type WhileStatement = [
   name: 'while',
   test: Expression,
   body: Statement
]

export type ForStatement = [
   name: 'for',
   init: VariableDeclaration | Expression | null,
   test: Expression | null,
   update: Expression | null,
   body: Statement
]

export type IteratorStatement = BreakStatement | ContinueStatement

export type BreakStatement = [
  'break',
  number | null
]

export type ContinueStatement = [
  'continue',
  number | null
]

export type ReturnStatement = [
   name: 'return',
   expr: Statement | null,
]

export type ThrowStatement = [
   parseInfo: ParseInfo,
   name: 'throw',
   expr: Statement | null,
]

export interface ParseInfo {
  line: number
}

export type ClassDeclaration = [
   name: 'class',
   id: Identifier,
   parent: Identifier | null,
   body: ClassBody
]

export type ClassBody =
   ['begin',
     FunctionDeclaration[]
   ]

/**
  * @link Wikipedia: https://en.wikipedia.org/wiki/Expression_(computer_science)
  * combination of one or more constants, variables, functions, and operators
  * that the programming language interprets
  */
export type Expression =
   AssignmentExpression
   | UnaryExpression
   | Literal

export type assignop = '=' | '+=' | '-=' | '*=' | '/='
export type logicalop = '&&' | '||'
export type binaryop = assignop | logicalop | '+' | '-' | '*' | '/' | '>' | '<' | '>=' | '<=' | '==' | '!=' | '===' | '!=='

export type AssignmentExpression = [
   op: assignop,
   id: Identifier | MemberExpression,
   assign: Expression
] | CallExpression // | BinaryExpression (circular reference handled by hand)

export type CallExpression = [
   name: 'callee',
   callee: MemberExpression | 'parent',
   args: Expression[]
] | MemberExpression

export type MemberExpression = [
   member: 'member',
   object: string,
   prop: string
]

export type LeftHandSideExpression = CallExpression

export type UnaryExpression = [
  binaryop,
  Expression,
]

export type BinaryExpression = [
  binaryop,
  BinaryExpression,
  BinaryExpression
] | PrimaryExpression

export type PrimaryExpression =
   Literal
   | Expression
   | Identifier
   | ThisExpression
   | ParentExpression
   | NewExpression
   | LambdaExpression

export type ThisExpression = 'this'

export type ParentExpression = 'parent'

export type NewExpression = [
   name: 'new',
   id: Identifier,
   args: Expression[]
]

export type LambdaExpression = [
   name: 'lambda',
   args: Expression[],
   body: Statement
]
export type Literal = string | number

export type Identifier = string
