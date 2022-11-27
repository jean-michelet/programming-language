export default [
  [
    `
    while (true) {
      if (0 === 0) {
        continue;
      }
    
      for (;;) break 2;
      for (;;) continue 2;
    
      break;
    }
    `,
    [
      'program',
      [
        [
          'while', 'true',
          [
            'begin',
            [
              [
                'if',
                ['===', 0, 0],
                [
                  'begin',
                  [['continue', null]]
                ],
                null
              ],
              ['for', null, null, null, ['break', 2]],
              ['for', null, null, null, ['continue', 2]],
              ['break', null]
            ]
          ]
        ]
      ]
    ]
  ], [
    'if (true) break;', new SyntaxError('Unsyntactic break Error on line 1')
  ], [
    'if (true) continue;', new SyntaxError('Unsyntactic continue Error on line 1')
  ]

]
