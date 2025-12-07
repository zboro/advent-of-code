import { readFile } from 'node:fs';

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n');

    let problems: string[][] = [];
    rows.forEach((row) => {
        row.split(' ').filter(part => part !== '').forEach((part, index) => {
            if (!problems[index]) {
                problems[index] = [part];
            } else {
                problems[index].push(part);
            }
        })
    });

    const results = problems.map(problem => {
        const operation = problem[problem.length - 1];
        const numbers = problem.slice(0, problem.length - 1);
        if (operation === '+') {
            return numbers.map(Number).reduce((sum, number) => sum + number, 0);
        }
        if (operation === '*') {
            return numbers.map(Number).reduce((sum, number) => sum * number, 1);
        }
        return 0;
    });

    const result = results.reduce((sum, a) => sum + a, 0);

    console.log(result);
});
