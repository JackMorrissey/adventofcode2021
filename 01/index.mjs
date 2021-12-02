import { readFile } from 'fs/promises';


async function partOne(depths) {
    let priorValue = depths[0];
    let increases = 0;
    for(let i = 1; i < depths.length; i++) {
        let currentValue = depths[i];
        if (currentValue > priorValue) {
            increases++;
        }
        priorValue = currentValue;
    }
    console.log(increases);
}

async function partTwo(depths) {
    let increases = 0;
    for(let i = 3; i < depths.length; i++) {
        const window1 = depths[i-3] + depths[i-2] + depths[i-1];
        const window2 = depths[i-2] + depths[i-1] + depths[i];
        if (window2 > window1) {
            increases++;
        }
    }
    console.log(increases);
}

async function main() {
    const contents = await readFile('input.txt', 'utf8');
    const depths = contents.split('\n').map((v) => parseInt(v, 10)).filter((v) => !isNaN(v));
    partOne(depths);
    partTwo(depths);
}

main().then(() => {
    console.log('Done!');
}, (e) => {
    console.error(e);
});