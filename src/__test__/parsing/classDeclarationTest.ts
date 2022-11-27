export default [
  [
    `
    class Square {}
    `,
    [
      'program',
      [
        ['class', 'Square', null, ['begin', []]]
      ]
    ]
  ],
  [
    `
    class Square extends Math {
      fn construct(x, y) {
        parent();
        this._x = x;
        this._y = y;
      }
    }
    
    let square = new Square(1, 2);
    `,
    [
      'program',
      [
        [
          'class', 'Square', 'Math',
          [
            'begin',
            [
              [
                { line: 3 },
                'fn',
                'construct',
                'method',
                false,
                ['x', 'y'],
                [
                  'begin',
                  [
                    ['callee', 'parent', []],
                    ['=', ['member', 'this', '_x'], 'x'],
                    ['=', ['member', 'this', '_y'], 'y']
                  ]
                ]
              ]
            ]
          ]
        ],
        [
          'let',
          'square',
          ['new', 'Square', [1, 2]]
        ]
      ]
    ]
  ],
  [
    `
    class Square {
      fn static staticMethod() { }
    }
    `,
    [
      'program',
      [
        [
          'class', 'Square', null,
          [
            'begin', [
              [
                { line: 3 },
                'fn',
                'staticMethod',
                'method',
                true,
                [],
                [
                  'begin', []
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ],
  [
    `
    class Square {
      callFunction();
    }
    `,
    new SyntaxError('Unexpected token "callFunction", expected FN on line 3')
  ]
]
