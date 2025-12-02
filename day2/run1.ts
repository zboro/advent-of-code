import { readFile } from 'node:fs';

function isInvalidId(id: number) {
    const idString = id.toString();
    const idLength = idString.length;
    if (idLength % 2 === 1) {
        return false;
    }
    return idString.substring(0, idLength / 2) === idString.substring(idLength / 2);
}

function getInvalidIdsFromRange(range: string): number[] {
    const [start, end] = range.split('-');
    if (start.length === end.length && start.length % 2 === 1) {
        return [];
    }
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
    console.log(sum)
});
