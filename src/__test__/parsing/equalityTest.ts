export default [
  [
      `
      x = 5 == 5;
      x = 5 != 5;
      x = 5 === 5;
      x = 5 !== 5;
      `,
      [
        'program',
        [
          ['=', 'x', ['==', 5, 5]],
          ['=', 'x', ['!=', 5, 5]],
          ['=', 'x', ['===', 5, 5]],
          ['=', 'x', ['!==', 5, 5]]
        ]
      ]
  ]
]
