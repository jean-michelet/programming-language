export default [
  [
        `
        let x = 0;
        while (x < 10) {
            x += 1;
            if (x == 5) {
                break;
            }
            x += 1;
        }
        x;
        `,
        5
  ], [
        `
        let level = '';
        while (true) {
        while (true) {
            while (true) {
            level = 'level 3';
            break 3;
            }
            level = 'level 2';
            break;
        }
        level = 'level 1';
        break;
        }
        level;
        `,
        'level 3'
  ], [
        `
        let x = 0;
        while (x < 100) {
            x += 1;
            if (x > 10) {
                continue;
                x += 200;
            }
            x += 1;
        }
        x;
        `,
        100
  ], [
        `
        let x = 0;
        let y = 0;
        while (x < 10) {
        x += 1;
        while (x < 10) {
            continue 2;
        }
        y += 1;
        }
        y;
        `,
        1
  ], [
        `
        fn test() {
            return fn () {
                return "hello";
            };
        }
        
        let t = test();
        t();
        `,
        'hello'
  ], [
        `
        let x = 1;
        fn test() {
            return x;

            x += 1;
        }
        test();
        `,
        1
  ], [
        `
        let x = 0;
        fn test() {
            throw 'This is an error';
        }

        fn test2() {
            return test();
        }

        fn test3() {
            return test2();
        }

        test3();
        `,
        `Error: This is an error line 4
at test3 line 11
at test2 line 7
at test line 3`
  ],
  ["throw 'This is an error';", 'Error: This is an error line 1']
]
