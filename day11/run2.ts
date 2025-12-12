import { readFile } from 'node:fs';

const cache: Record<string, string[][]> = {

};

function traverse(devices: Record<string, string[]>, currentDevice: string[], path: string[], target: string): string[][] | undefined {
    if (!currentDevice) {
        return undefined;
    }

    return currentDevice.reduce((previousPaths: string[][], output) => {
        if (output === target) {
            return [...previousPaths, [...path, output]];
        }
        if (path.includes(output)) {
            return [...previousPaths];
        }

        let result;
        if (cache[`${output}-${target}`]) {
            result = cache[`${output}-${target}`];
        } else {
            result = traverse(devices, devices[output], [output], target);
            cache[`${output}-${target}`] = result!;
        }

        return [...previousPaths, ...(result?.map(newPath => [...path, ...newPath]) ?? [])];
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

    const pathsToFft = traverse(devices, devices.svr, ['svr'], 'fft');
    const pathsToDac = traverse(devices, devices.fft, ['fft'], 'dac');
    const pathsToOut = traverse(devices, devices.dac, ['dac'], 'out');

    console.log(pathsToFft?.length! * pathsToDac?.length! * pathsToOut?.length!);
});
