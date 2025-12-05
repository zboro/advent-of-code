import { readFile } from 'node:fs';

function parseRanges(stringRanges: string[]): [number, number][] {
    return stringRanges.map(range => range.split('-')).map(([start, end]) => [Number(start), Number(end)]);
}

function isFresh(id: number, ranges: [number, number][]) {
    return ranges.some(([start, end]) => id >= start && id <= end);
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n');

    const splitIndex = rows.findIndex((row) => row === '');

    const ranges = parseRanges(rows.splice(0, splitIndex));

    rows.shift();
    rows.pop();

    const fresh: string[] = [];

    rows.forEach((id) => {
        if (isFresh(Number(id), ranges)) {
            fresh.push(id);
        }
    })


    console.log(fresh.length);
});
