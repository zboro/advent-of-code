import { readFile } from 'node:fs';

type Connection = {
    index: number;
    junctions: [number, number];
    distance: number;
};

type Junction = [number, number, number];

function calculateDistance([x1, y1, z1]: Junction, [x2, y2, z2]: Junction): number {
    const a = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return Math.sqrt(Math.pow(a, 2) + Math.pow(z2 - z1, 2));
}

let circuitCounter = 0;

function addConnection(circuits: Record<number, number[]>, connection: Connection) {
    let match1: number | undefined;
    let match2: number | undefined;
    for (let circuit in circuits) {
        if (circuits[circuit].includes(connection.junctions[0])) {
            match1 = Number(circuit);
        };
        if (circuits[circuit].includes(connection.junctions[1])) {
            match2 = Number(circuit);
        };
    }

    if (match1 === undefined && match2 === undefined) {
        circuits[circuitCounter++] = [...connection.junctions];
        return;
    }
    if (match1 !== undefined && match2 === undefined) {
        circuits[match1].push(connection.junctions[1]);
        return;
    }
    if (match1 === undefined && match2 !== undefined) {
        circuits[match2].push(connection.junctions[0]);
        return;
    }
    if (match1 !== undefined && match2 !== undefined && match1 === match2) {
        return;
    }
    if (match1 !== undefined && match2 !== undefined && match1 !== match2) {
        circuits[match1] = [...circuits[match1], ...circuits[match2]];
        delete circuits[match2];
        return;
    }

}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n').filter(Boolean);

    const junctions: Junction[] = rows.map(rows => rows.split(',').map(Number)) as Junction[];

    const connections: Connection[] = [];

    for (let i = 0; i < junctions.length; i++) {
        for (let j = i + 1; j < junctions.length; j++) {
            const distance = calculateDistance(junctions[i], junctions[j]);
            connections.push({
                index: i,
                junctions: [i, j],
                distance,
            });
        }
    }

    connections.sort((a, b) => a.distance - b.distance);

    const circuits: Record<number, number[]> = {};

    let i = 0;
    while (true) {
        addConnection(circuits, connections[i]);

        const circuitLengths = Object.values(circuits).map(c => c.length);
        if (circuitLengths.length === 1 && circuitLengths[0] === junctions.length) {
            console.log(junctions[connections[i].junctions[0]][0] * junctions[connections[i].junctions[1]][0]);
            break;
        }
        i++;
    }
});
