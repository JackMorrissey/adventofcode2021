import { readFile } from "fs/promises";

function calculateGammaEpsilon(listOfBits) {
  let positionCounts = [];
  // I'm sure there is a fancy functional way to do this...
  for(let i = 0; i < listOfBits[0].length; i++) {
    positionCounts.push(0);
  }
  const gamma = [...positionCounts];
  const epsilon = [...positionCounts];

  listOfBits.forEach(bits => {
      bits.forEach((val, i) => {
        positionCounts[i] += val;
      })
  });

  positionCounts.forEach((val, i) => {
    gamma[i] = val >= listOfBits.length / 2 ? 1 : 0;
    epsilon[i] = val < listOfBits.length / 2 ? 1 : 0;
  });

  return {
    gamma,
    epsilon
  }
}

function partOne(listOfBits) {
  const {gamma, epsilon} = calculateGammaEpsilon(listOfBits);

  const gammaInt = parseInt(gamma.join(''), 2);
  const epsilonInt = parseInt(epsilon.join(''), 2);

  // console.log(positionCounts, gamma, epsilon, gammaInt, epsilonInt);
  const submarinePowerConsumption = gammaInt * epsilonInt;
  console.log(submarinePowerConsumption);

}

function getBitMatches(listOfBits, bitIndex, powerInfoTarget) {
  let pastThisRound = [];
  if (listOfBits.length < 2) {
    return listOfBits;
  }
  for(let i = 0; i < listOfBits.length; i++) {
    const bitsToTest = listOfBits[i];
    if (bitsToTest[bitIndex] === powerInfoTarget[bitIndex]) {
      pastThisRound.push(bitsToTest); // still good!
    }
  }
  return pastThisRound;
}

function partTwo(listOfBits) {
  const bitsLength = listOfBits[0].length;
  let inTheRunningGamma = [...listOfBits];
  let inTheRunningEpsilon = [...listOfBits];
  for(let i = 0; i < bitsLength; i++) {
    if (inTheRunningGamma.length > 1) {
      const { gamma } = calculateGammaEpsilon(inTheRunningGamma);
      inTheRunningGamma = getBitMatches(inTheRunningGamma, i, gamma);
    }
    if (inTheRunningEpsilon.length > 1) {
      const { epsilon } = calculateGammaEpsilon(inTheRunningEpsilon);
      inTheRunningEpsilon = getBitMatches(inTheRunningEpsilon, i, epsilon);
    }
  }

  // console.log(inTheRunningGamma, inTheRunningEpsilon)

  const oxygenGeneratorInt = parseInt(inTheRunningGamma[0].join(''), 2);
  const c02ScrubberInt = parseInt(inTheRunningEpsilon[0].join(''), 2);
  const lifeSupportRating = oxygenGeneratorInt * c02ScrubberInt;
  console.log(lifeSupportRating);
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n").filter((v) => !!v);
  const listOfBits = lines.map((l) => l.split(/(\d)/).filter((f) => f !== '').map(f => parseInt(f, 10)));
  partOne(listOfBits);
  partTwo(listOfBits);
}

main().then(
  () => {
    console.log("Done!");
  },
  (e) => {
    console.error(e);
  }
);
