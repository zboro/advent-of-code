import { readFile } from 'node:fs';

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n').filter(Boolean);

    let problems: {
        numbers: number[];
        operator: '+' | '*' | null;
    }[] = [];
    const map: string[][] = rows.map((row) => {
        return row.split('');
    });

    const mapWidth = Math.max(...map.map(row => row.length));
    let problemIndex = 0;
    let currentProblemsFirstrCol = 0
    for (let j = 0; j < mapWidth; j++) {
        let isGap = true;
        for (let i = 0; i < map.length - 1; i++) {
            if (map[i][j] === ' ') {
                continue;
            }
            isGap = false;
            if (!problems[problemIndex]) {
                problems[problemIndex] = {
                    operator: null,
                    numbers: []
                }
            }
            const numberIndex = j - currentProblemsFirstrCol;
            if (!problems[problemIndex].numbers[numberIndex]) {
                problems[problemIndex].numbers[numberIndex] = Number(map[i][j]);
            } else {
                problems[problemIndex].numbers[numberIndex] = 10 * problems[problemIndex].numbers[numberIndex] + Number(map[i][j]);
            }
        }
        if (isGap) {
            currentProblemsFirstrCol = j + 1;
            problemIndex++;
        }
    }

    rows[rows.length - 1].split(' ').filter(Boolean).forEach((value, index) => problems[index].operator = value as '+' | '*');

    const results = problems.map(problem => {
        const operation = problem.operator;
        const numbers = problem.numbers;
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
