import { readFile } from 'node:fs';

type Button = {
    numbers: number[];
};

type Machine = {
    targetPattern: string;
    buttons: Button[];
};

function readMachine(row: string): Machine {
    const parts = row.split(' ');
    const target = parts.shift();
    const joltage = parts.pop();
    const buttons = parts.map(part => {
        return {
            numbers: part.substring(1, part.length - 1).split(',').map(Number)
        };
    });
    return {
        targetPattern: target!.substring(1, target!.length - 1),
        buttons,
    }
}

function updatePattern(pattern: string, indexes: number[]): string {
    const newPattern = pattern.split('');
    for (let i = 0; i < indexes.length; i++) {
        newPattern[indexes[i]] = newPattern[indexes[i]] === '.' ? '#' : '.';
    }
    // console.log('updated pattern', pattern, indexes, newPattern);
    return newPattern.join('');
}

function findCombinationDepth(machine: Machine) {
    let i = 1;
    let presses = machine.buttons.map(button => ({
        buttons: [button],
        currentPattern: updatePattern(Array(machine.targetPattern.length).fill('.').join(''), button.numbers),
    }));
    if (presses.some(press => press.currentPattern === machine.targetPattern)) {
        return 1;
    }
    while (true) {
        const newPresses = [];
        for (let j = 0; j < presses.length; j++) {
            for (let k = 0; k < machine.buttons.length; k++) {
                const newPattern = updatePattern(presses[j].currentPattern, machine.buttons[k].numbers);
                if (newPattern === machine.targetPattern) {
                    return i + 1;
                }
                newPresses.push({
                    currentPattern: newPattern,
                    buttons: [...presses[j].buttons, machine.buttons[k]],
                });
            }
        }
        presses = newPresses;
        i++;
    }
    // console.log(JSON.stringify(presses, null, 2));
}

readFile(process.argv[2], 'utf-8', (err, data) => {
    const rows = data.split('\n').filter(Boolean);

    const machines = rows.map(readMachine);

    // console.log(JSON.stringify(machines));

    const depths = machines.map(findCombinationDepth)
    // console.log(findCombinationDepth(machines[0]));

    console.log(depths.reduce((sum, a) => sum + a));
});
