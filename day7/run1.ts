import { readFile } from 'node:fs';

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n').filter(Boolean);

    const map: string[][] = rows.map(rows => rows.split(''));

    let splits = 0;

    let beams = [map[0].indexOf('S')];

    for (let i = 1; i < map.length; i++) {
        const newBeams = new Set<number>();
        for (let b = 0; b < beams.length; b++) {
            if (map[i][beams[b]] === '^') {
                newBeams.add(beams[b] - 1);
                newBeams.add(beams[b] + 1);
                splits++;
            } else {
                newBeams.add(beams[b]);
            }
        }
        beams = Array.from(newBeams);
    }

    console.log(splits);
});
