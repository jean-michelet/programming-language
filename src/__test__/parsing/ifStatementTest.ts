export default [
  [
    'if (a) {a = 1;}',
    [
      'program',
      [
        [
          'if', 'a',
          ['begin',
            [
              ['=', 'a', 1]
            ]
          ],
          // else
          null
        ]
      ]
    ]
  ], [
    'if (a) {a = 1;} else {a = b;}',
    [
      'program',
      [
        [
          'if', 'a',
          ['begin',
            [
              ['=', 'a', 1]
            ]
          ],
          // else
          ['begin',
            [['=', 'a', 'b']]
          ]
        ]
      ]
    ]
  ], [
    'if (a) {a = 1;} else if (b) {a = b;} else a = c;',
    [
      'program',
      [
        [
          'if', 'a',
          ['begin',
            [
              ['=', 'a', 1]
            ]
          ],
          // else if
          ['if', 'b',
            ['begin',
              [['=', 'a', 'b']]
            ],
            // else
            ['=', 'a', 'c']
          ]
        ]
      ]
    ]
  ]
]
