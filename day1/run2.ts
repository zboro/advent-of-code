import { readFile } from 'node:fs';

readFile(process.argv[2], 'utf-8', (err, data) => {
    let result = 0;
    let position = 50;
    data.split('\n').forEach((line) => {
        const value = Number(line.substring(1));
        const fullTurns = Math.floor(value / 100);
        if (!line) {
            return;
        }
        if (line.startsWith('L')) {
            if (value > position) {
                result += Math.floor((value) / 100);
            }
            if (position > 0 && value % 100 >= position) {
                result++;
            }
            position = (100 + position - value) % 100;
            if (position < 0) {
                position = 100 + position;
            }
        }
        if (line.startsWith('R')) {
            result += Math.floor((position + value) / 100);
            position = (position + value) % 100;
        }
    });
    console.log(result);
})
