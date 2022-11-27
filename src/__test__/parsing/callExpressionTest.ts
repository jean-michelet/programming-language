export default [
  [
      `
    fn x(y = 1) {}
    x(x + 1, 2);
    `,
      [
        'program',
        [
          [
            { line: 2 },
            'fn',
            'x',
            'function',
            false,
            [
              ['=', 'y', 1]
            ],
            ['begin', []]
          ], [
            'callee',
            'x',
            [
              ['+', 'x', 1],
              2
            ]
          ]
        ]
      ]
  ]
]
