import { readFile } from 'node:fs';

type Button = {
    numbers: number[];
};

type Machine = {
    targetPattern: string;
    buttons: Button[];
    joltages: number[];
};

function readMachine(row: string): Machine {
    const parts = row.split(' ');
    const target = parts.shift();
    const joltage = parts.pop();
    // console.log(joltage)
    const buttons = parts.map(part => {
        return {
            numbers: part.substring(1, part.length - 1).split(',').map(Number)
        };
    });
    return {
        joltages: joltage!.substring(1, joltage!.length - 1).split(',').map(Number),
        buttons,
        targetPattern: '',
    }
}

function updatePattern(pattern: number[], indexes: number[]): number[] {
    const newPattern = [...pattern];
    for (let i = 0; i < indexes.length; i++) {
        newPattern[indexes[i]] = newPattern[indexes[i]] + 1;
    }
    // console.log('updated pattern', pattern, indexes, newPattern);
    return newPattern;
}

function isTooLarge(joltages: number[], newPattern: number[]) {
    return joltages.some((expected, index) => newPattern[index] > expected);
}

function findCombinationDepth(machine: Machine) {
    let i = 1;
    let presses = machine.buttons.map(button => ({
        buttons: [button],
        currentPattern: updatePattern(Array(machine.joltages.length).fill(0), button.numbers),
    }));
    if (presses.some(press => press.currentPattern.join('') === machine.joltages.join(''))) {
        return 1;
    }
    console.log(JSON.stringify(presses, null, 2))
    while (true) {
        const newPresses = [];
        for (let j = 0; j < presses.length; j++) {
            for (let k = 0; k < machine.buttons.length; k++) {
                const newPattern = updatePattern(presses[j].currentPattern, machine.buttons[k].numbers);
                if (i >= 9) {
                    // console.log(newPattern, machine.joltages)
                }
                if (newPattern.join('') === machine.joltages.join('')) {
                    console.log('FOund !!!!!!!!!!!!!!!!!!')
                    return i + 1;
                }
                if (isTooLarge(machine.joltages, newPattern)) {
                    continue;
                }
                newPresses.push({
                    currentPattern: newPattern,
                    buttons: [machine.buttons[k]],
                });
            }
        }
        // console.log(i);
        presses = newPresses;
        i++;
    }
    // console.log(JSON.stringify(presses, null, 2));
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n').filter(Boolean);

    const machines = rows.map(readMachine);

    console.log(JSON.stringify(machines));

    const depths = machines.map(findCombinationDepth)
    // console.log(findCombinationDepth(machines[0]));

    console.log(depths.reduce((sum, a) => sum + a, 0));
});
