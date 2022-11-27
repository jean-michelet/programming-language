export default [
  [
    'while (x > 1) x = x - 1;',
    [
      'program',
      [
        [
          'while',
          ['>', 'x', 1],
          ['=', 'x', ['-', 'x', 1]]
        ]
      ]
    ]
  ]
]
