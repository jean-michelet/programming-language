export default [
  [
    'for (let x = 1; x < 1; x + 1) x = x - 1;',
    [
      'program',
      [
        [
          'for',
          ['let', 'x', 1],
          ['<', 'x', 1],
          ['+', 'x', 1],
          ['=', 'x', ['-', 'x', 1]]
        ]
      ]
    ]
  ],
  [
    'for (;;x + 1) x = x - 1;',
    [
      'program',
      [
        [
          'for',
          null,
          null,
          ['+', 'x', 1],
          ['=', 'x', ['-', 'x', 1]]
        ]
      ]
    ]
  ],
  [
    'for (;;) x = x - 1;',
    [
      'program',
      [
        [
          'for',
          null,
          null,
          null,
          ['=', 'x', ['-', 'x', 1]]
        ]
      ]
    ]
  ]
]
