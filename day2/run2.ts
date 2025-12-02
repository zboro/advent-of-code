import { readFile } from 'node:fs';

function isInvalidId(id: number) {
    const idString = id.toString();
    const idLength = idString.length;
    // for (let i = Math.floor(idLength / 2); i > 0; i--) {
    for (let i = 1; i <= Math.floor(idLength / 2); i++) {
        const part = idString.substr(0, i);
        if (idLength % i === 0 && idString.split(part).join('') === '') {
            return true;
        }
    }
    return false;
}

function getInvalidIdsFromRange(range: string): number[] {
    const [start, end] = range.split('-');
    const invalidIds = [];

    for (let i = Number(start); i <= Number(end); i++) {
        if (isInvalidId(i)) {
            invalidIds.push(i);
        }
    }

    return invalidIds;
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const invalidIds: number[] = [];
    data.split(',').forEach((range) => {
        invalidIds.push(...getInvalidIdsFromRange(range))
    });
    const sum = invalidIds.reduce((sum, id) => sum + id, 0)
    console.log(sum);
});
