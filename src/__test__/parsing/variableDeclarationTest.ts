export default [
  [
        `
        let a;
        let x = a + 3;
        const y = x;
        `,
        [
          'program',
          [
            ['let', 'a', null],
            ['let', 'x', ['+', 'a', 3]],
            ['const', 'y', 'x']
          ]
        ]
  ], [
    'const y;',
    new SyntaxError('const declaration must be initialized')
  ]
]
