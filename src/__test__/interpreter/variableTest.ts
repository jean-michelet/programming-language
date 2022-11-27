export default [
  ['let x = 4;', 4],

  ['let x = 2; let x = 1;', new Error('Cannot redeclare block-scoped "x"')],
  ['let x = 2; const x = 1;', new Error('Cannot redeclare block-scoped "x"')],
  ['let y = 2; {let y = 4;{y;}}', 4],

  ['let x = 2; notDeclaredVar = 1;', new ReferenceError('"notDeclaredVar" is not defined')],

  // assignment
  ['const c = 4;', 4],
  ['const c = 4;c = 3;', new Error('Invalid assignment to const "c"')],
  [
        `
        let x = 10;
        x = 2;
        x += 4;
        x -= 3;
        x *= 2;
        x /= 3;`,
        2
  ],
  [
        `
        let x = 10;
        {
         let x = 4;
        }
        x;
        `,
        10
  ],

  // default contants
  ['true;{true;}', true],
  ['false;', false],
  ['null;', null]
]
