export default [
  [
    'true === true && false === false || true !== true && false !== false;',
    [
      'program',
      [
        [
          '||',
          ['&&', ['===', 'true', 'true'], ['===', 'false', 'false']],
          ['&&', ['!==', 'true', 'true'], ['!==', 'false', 'false']]
        ]
      ]
    ]
  ]
]
