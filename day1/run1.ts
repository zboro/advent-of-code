import { readFile } from 'node:fs';

readFile(process.argv[2], 'utf-8', (err, data) => {
    let result = 0;
    let position = 50;
    data.split('\n').forEach((line) => {
        if (!line) {
            return;
        }
        const value = Number(line.substring(1));
        if (line.startsWith('L')) {
            position -= value;
        }
        if (line.startsWith('R')) {
            position += value;
        }
        if(position % 100 === 0) {
            result++;
        }
    });
    console.log(result);
})
