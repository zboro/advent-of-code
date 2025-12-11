import { readFile } from 'node:fs';

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n').filter(Boolean);

    const positions = rows.map(row => row.split(',')).map(([x, y]) => [Number(x), Number(y)]);

    const width = Math.max(...positions.map(([x]) => x));


    const leftRight = positions.map(([x, y]) => [x, y, x + y]).sort((a, b) => a[2] - b[2]);
    const rightLeft = positions.map(([x, y]) => [x, y, width - x + y]).sort((a, b) => a[2] - b[2]);

    console.log(leftRight);
    console.log(rightLeft);

    const leftRightSize = (leftRight[leftRight.length - 1][0] - leftRight[0][0] + 1) * (leftRight[leftRight.length - 1][1] - leftRight[0][1] + 1);

    const rightLeftSize = (rightLeft[0][0] - rightLeft[rightLeft.length - 1][0] + 1) * (rightLeft[rightLeft.length - 1][1] - rightLeft[0][1] + 1);

    console.log(Math.max(leftRightSize, rightLeftSize));
});
