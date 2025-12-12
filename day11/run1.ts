import { readFile } from 'node:fs';

function traverse(devices: Record<string, string[]>, currentDevice: string[], path: string[]): string[][] {
    // console.log(currentDeviceName, currentDevice)
    return currentDevice.reduce((previousPaths: string[][], output) => {
        if (output === 'out' || path.includes(output)) {
            return [...previousPaths, [...path, output]];
        }
        return [...previousPaths, ...traverse(devices, devices[output], [...path, output])];
    }, []);
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n').filter(Boolean);

    const devices: Record<string, string[]> = {};
    rows.forEach((row) => {
        const [name, outputString] = row.split(':');
        const outputs = outputString.split(' ').filter(Boolean);
        devices[name] = outputs;
    });

    const paths = traverse(devices, devices.you, ['you']);

    console.log(paths.length);
});
