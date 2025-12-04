import { readFile } from 'node:fs';

function isMatch(map: string[][], row: number, col: number): boolean {
    const neighbors = [
        [row - 1, col - 1],
        [row - 1, col],
        [row - 1, col + 1],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col - 1],
        [row + 1, col],
        [row + 1, col + 1],
    ];

    const filledNeighbors = neighbors.filter(neighbor => map[neighbor[0]]?.[neighbor[1]] === '@');

    return filledNeighbors.length < 4;
}

function removeMatches(map: string[][], matches: number[][]) {
    matches.forEach(match => map[match[0]][match[1]] = '.');
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n');
    const map = rows.map(row => row.split(''));

    let removed = 0;

    while (true) {
        const matches = [];

        for (let i = 0; i < map.length; i++) {
            const row = map[i];
            for (let j = 0; j < row.length; j ++) {
                if (map[i][j] === '@' && isMatch(map, i, j)) {
                    matches.push([i, j]);
                }
            }
        }

        if (matches.length === 0) {
            break;
        }

        removed += matches.length;

        removeMatches(map, matches);
    }

    console.log(removed);
});
