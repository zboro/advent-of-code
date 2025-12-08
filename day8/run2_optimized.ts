import { readFile } from 'fs';

type Connection = {
    junction1: number;
    junction2: number;
    distance: number;
};

type Junction = [number, number, number];

function calculateDistance([x1, y1, z1]: Junction, [x2, y2, z2]: Junction): number {
    return ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1));
}

let circuitCounter = 0;

function addConnection(circuits: Record<number, Set<number>>, connection: Connection) {
    let match1: number | undefined;
    let match2: number | undefined;
    const junction1 = connection.junction1;
    const junction2 = connection.junction2;
    for (let circuit in circuits) {
        const circuitJunctions = circuits[circuit];
        if (circuitJunctions.has(junction1)) {
            match1 = Number(circuit);
        };
        if (circuitJunctions.has(junction2)) {
            match2 = Number(circuit);
        };
    }

    if (match1 === undefined && match2 === undefined) {
        circuits[circuitCounter++] = new Set([junction1, junction2]);
        return 0;
    }
    if (match1 !== undefined && match2 === undefined) {
        circuits[match1].add(junction2);
        return circuits[match1].size;
    }
    if (match1 === undefined && match2 !== undefined) {
        circuits[match2].add(junction1);
        return circuits[match2].size;
    }
    if (match1 === match2) {
        return 0;
    }
    circuits[match1!] = new Set([...circuits[match1!], ...circuits[match2!]]);
    delete circuits[match2!];
    return circuits[match1!].size;
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n').filter(Boolean);
    const junctions: Junction[] = rows.map(rows => rows.split(',').map(Number)) as Junction[];
    let connections: Connection[] = [];

    for (let i = 0; i < junctions.length; i++) {
        for (let j = i + 1; j < junctions.length; j++) {
            const distance = calculateDistance(junctions[i], junctions[j]);
            connections.push({
                junction1: i,
                junction2: j,
                distance,
            });
        }
    }
    connections.sort((a, b) => a.distance - b.distance);
    const circuits: Record<number, Set<number>> = {};

    let i = 0;
    const junctionsLength = junctions.length;
    while (addConnection(circuits, connections[i++]) !== junctionsLength);
    console.log(junctions[connections[i - 1].junction1][0] * junctions[connections[i - 1].junction2][0]);
});
