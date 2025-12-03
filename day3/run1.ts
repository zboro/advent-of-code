import { readFile } from 'node:fs';

readFile(process.argv[2], 'utf-8', (err, data) => {
    const banks = data.split('\n');
    const voltages = banks.map((bank) => {
        const length = bank.length;
        let a = 0;
        let b = 0;
        bank.split('').map(Number).forEach((n, i) => {
            if (n > a && i < length - 1) {
                a = n;
                b = 0;
                return;
            }
            if (n > b) {
                b = n;
            }
        });
        return a * 10 + b;
    });
    const sum = voltages.reduce((a, b) => a + b, 0);
    console.log(sum);
});
