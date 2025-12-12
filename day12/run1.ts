import { readFile } from 'node:fs';

readFile(process.argv[2], 'utf-8', (err, data) => {
    const sections = data.split('\n\n').filter(Boolean);

    console.log(sections);

    const areas = sections[sections.length - 1].split('\n').filter(Boolean).map((row) => {
        const [areaPart, countsPart] = row.split(':');
        const dimensions = areaPart.split('x').map(Number);
        const counts = countsPart.split(' ').filter(Boolean).map(Number);

        return {
            dimensions,
            counts,
        }
    });

    const fits = areas.filter(area => {
        const partsSum = area.counts.reduce((sum, a) => sum + a, 0);
        return (area.dimensions[0] * area.dimensions[1]) > partsSum * 7;
    })

    console.log(fits.length);
});
