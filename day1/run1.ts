import { readFile } from 'node:fs';

readFile(process.argv[2], 'utf-8', (err, data) => {
    let result = 0;
    let position = 50;
    data.split('\n').forEach((line) => {
        const value = Number(line.substring(1));
        if (!line) {
            return;
        }
        if (line.startsWith('L')) {
            position = (100 + position - value) % 100;
            if (position < 0) {
                position = 100 + position;
            }
        }
        if (line.startsWith('R')) {
            position = (position + value) % 100;
        }
        if(position === 0) {
            result++;
        }
    });
    console.log(result);
})
