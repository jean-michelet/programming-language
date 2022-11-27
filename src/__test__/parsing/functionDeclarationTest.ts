export default [
  [
      `
      fn static add() {}
      fn add(x, y) {}
      fn add(x, y) {
        return x + 1;
      }
      fn add(x, y) {
        return;
      }
      `,
      [
        'program',
        [
          [
            { line: 2 },
            'fn',
            'add',
            'function',
            true,
            [],
            ['begin', []]
          ],
          [
            { line: 3 },
            'fn',
            'add',
            'function',
            false,
            ['x', 'y'],
            ['begin', []]
          ],
          [
            { line: 4 },
            'fn',
            'add',
            'function',
            false,
            ['x', 'y'],
            [
              'begin',
              [
                ['return', ['+', 'x', 1]]
              ]
            ]
          ],
          [
            { line: 7 },
            'fn',
            'add',
            'function',
            false,
            ['x', 'y'],
            [
              'begin',
              [['return', null]]
            ]
          ]
        ]
      ]
  ], [
    'return 1;',
    new SyntaxError('\'return\' outside of function on line 1')
  ]
]
