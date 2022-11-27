export default [
  [
        `
        let x = 0;
        while (x < 10) 
            x += 1;
            
        x;
        `,
        10
  ], [
        `
        let x = 0;
        while (x < 10) {
            while (x < 1) {
                x += 20;
            }
        }
            
        x;
        `,
        20
  ]
]
