import { readFile } from 'node:fs';

function parseRanges(stringRanges: string[]): [number, number][] {
    return stringRanges.map(range => range.split('-')).map(([start, end]) => [Number(start), Number(end)]);
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n');

    const splitIndex = rows.findIndex((row) => row === '');

    const ranges = parseRanges(rows.splice(0, splitIndex));

    let prevRanges = ranges;

    while (true) {
        const limitedRanges = prevRanges.reduce<[number, number][]>((prev, range1, index) => {
            if (index === prevRanges.length - 1) {
                return [...prev, range1];
            }
            for (let i = index + 1; i < prevRanges.length; i++) {
                const range2 = prevRanges[i];
                if (range1[0] >= range2[0] && range1[1] <= range2[1]) { // this range is inside another
                    return prev;
                }

                if (range1[0] <= range2[0] && range1[1] >= range2[1]) { // this range around another
                    range2[0] = range1[0];
                    range2[1] = range1[1];
                    return prev;
                }

                if (range1[0] < range2[0] && range1[1] >= range2[0] && range1[1] <= range2[1]) { // extend range2 to the left with range 1
                    range2[0] = range1[0];
                    return prev;
                }

                if (range1[0] >= range2[0] && range1[0] <= range2[1] && range1[1] > range2[0]) { // extend range2 to the right with range 1
                    range2[1] = range1[1];
                    return prev;
                }
            }
            return [...prev, range1];
        }, []);
        if (prevRanges.length === limitedRanges.length) {
            prevRanges = limitedRanges;
            break;
        } else {
            prevRanges = limitedRanges;
        }
    }

    console.log(prevRanges.reduce((sum, range) => {
        return sum + (range[1] - range[0] + 1);
    }, 0));
});
