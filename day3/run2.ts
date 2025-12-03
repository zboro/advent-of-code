import { readFile } from 'node:fs';

function clearRest(battery: number[], index: number) {
    for (let i = index + 1; i < battery.length; i++) {
        battery[i] = 0;
    }
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const banks = data.split('\n');
    const voltages = banks.map((bank) => {
        const length = bank.length;
        const battery = Array(12).fill(0);
        bank.split('').map(Number).forEach((n, i) => {
            for (let j = 0; j < 12; j++) {
                if (n > battery[j] && i <= length - 12 + j ) {
                    battery[j] = n;
                    clearRest(battery, j);
                    return;
                }
            }
        });
        return battery.reduce((prev, current) => {
            return prev * 10 + current;
        }, 0);
    });
    const sum = voltages.reduce((a, b) => a + b, 0);
    console.log(sum);
});
