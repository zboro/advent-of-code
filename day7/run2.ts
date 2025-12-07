import { readFile } from 'node:fs';

function addBeam(newBeamIndex, beamTimes, beams) {
    if (beams[newBeamIndex] === undefined) {
        beams[newBeamIndex] = beamTimes;
        return;
    }

    beams[newBeamIndex] = beams[newBeamIndex] + beamTimes;
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n').filter(Boolean);

    const map: string[][] = rows.map(rows => rows.split(''));

    type Beam = {
        index: number;
        times: number;
    };

    let beams: Record<number, number> = {
        [map[0].indexOf('S')]: 1
    };

    for (let i = 1; i < map.length; i++) {
        const newBeams = {};
        const beamIndexes = Object.keys(beams).map(Number);
        for (let b = 0; b < beamIndexes.length; b++) {
            if (map[i][beamIndexes[b]] === '^') {
                addBeam(beamIndexes[b] - 1, beams[beamIndexes[b]], newBeams);
                addBeam(beamIndexes[b] + 1, beams[beamIndexes[b]], newBeams);
            } else {
                addBeam(beamIndexes[b], beams[beamIndexes[b]], newBeams);
            }
        }
        beams = newBeams;
    }

    console.log(Object.values(beams).reduce((sum, a) => sum + a, 0));
});
