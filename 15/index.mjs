import { readFile } from 'fs/promises';

const failedPath = Number.MAX_SAFE_INTEGER;

function getSimplePathRisk(numberLines) {
  // make an L
  let risk = numberLines[0][0];
  for (let i = 1; i < numberLines.length; i++) {
    risk += numberLines[i][0];
  }
  for (let j = 1; j < numberLines[0].length; j++) {
    risk += numberLines[numberLines.length - 1][j];
  }
  return risk;
}

function getValidPositions(atRowI, atColJ, positions, visitedPositions) {
  const validPositions = [];

  if (atRowI < positions.length - 1 && !visitedPositions.has(`${atRowI + 1}-${atColJ}`)) {
    validPositions.push({
      i: atRowI + 1,
      j: atColJ,
    });
  }
  if (atColJ < positions[0].length - 1 && !visitedPositions.has(`${atRowI}-${atColJ + 1}`)) {
    validPositions.push({
      i: atRowI,
      j: atColJ + 1,
    });
  }
  if (atColJ > 1 && !visitedPositions.has(`${atRowI}-${atColJ - 1}`)) {
    validPositions.push({
      i: atRowI,
      j: atColJ - 1,
    });
  }
  if (atRowI > 1 && !visitedPositions.has(`${atRowI - 1}-${atColJ}`)) {
    validPositions.push({
      i: atRowI - 1,
      j: atColJ,
    });
  }
  return validPositions;
}

function traverseForRisk(
  atRowI,
  atColJ,
  positions,
  visitedPositions,
  currentRisk,
  toBeatRisk,
) {
  if (atRowI === positions.length - 1 && atColJ === positions[0].length - 1) {
    return currentRisk;
  }

  if (currentRisk > toBeatRisk) {
    return failedPath;
  }

  const validPaths = getValidPositions(atRowI, atColJ, positions, visitedPositions);
  if (!validPaths.length) {
    return failedPath;
  }

  let currentBestRisk = toBeatRisk;
  validPaths.forEach((p) => {
    const nextVisited = new Set(visitedPositions);
    nextVisited.add(`${p.i}-${p.j}`);
    const nextRisk = currentRisk + positions[p.i][p.j];
    const resultingRisk = traverseForRisk(p.i, p.j, positions, nextVisited, nextRisk, currentBestRisk);
    if (resultingRisk < currentBestRisk) {
      currentBestRisk = resultingRisk;
    }
  });
  return currentBestRisk;
}

function partOne(positions) {
  const simpleRisk = getSimplePathRisk(positions);
  const lowestRisk = traverseForRisk(0, 0, positions, new Set(['0-0']), 0, simpleRisk);
  console.log(lowestRisk);
};

function partTwo(polymerTemplate, rules, depth) {

}

function getSampleLines() {
  return [
    '1163751742',
    '1381373672',
    '2136511328',
    '3694931569',
    '7463417111',
    '1319128137',
    '1359912421',
    '3125421639',
    '1293138521',
    '2311944581',
  ];
}

async function main() {
  const contents = await readFile('input.txt', 'utf8');
  const lines = contents.split('\n');
  const numberLines = lines
  // const numberLines = getSampleLines()
    .filter((l) => !!l)
    .map((l) => l.split('').map((c) => parseInt(c, 10)));
  partOne(numberLines);
  // partTwo(numberLines);
}

main().then(
  () => {
    console.log('Done!');
  },
  (e) => {
    console.error(e);
    console.error(e.stack);
  },
);
