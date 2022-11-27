export default [
  [
        `
        let x = 1;
        if (x == 1) {
            x = 2;
        }

        if (x != 2) 
            x = null; 
        else if (x == 2) 
            x = 3;

        if (x != 3) 
            x = null; 
        else x = 5;
        `,
        5
  ]
]
