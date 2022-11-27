export default [
  [
        `
        fn test(x) {
            let z = 3;
            fn nested (y) {
                return x + y + z;
            }

            return nested;
        }

        let nested = test(1);

        nested(2);
        `,
        6
  ], [
        `
        let x = fn (y) {
            return 3;
        };
        x();
        `,
        3
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
            if (x > 1002) {
                return x;
            }

            x += 1;

            return test();
        }

        fn test2() {
        return test();
        }

        fn test3() {
        return test2();
        }

        test3();
        `,
        `RangeError: Max call stack size exceeded
at test3 line 17
at test2 line 13
at test line 3`
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
  ]
]
