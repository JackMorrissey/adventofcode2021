import { readFile } from "fs/promises";

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

function getValidPositions(point, positions) {
  const validPositions = [];
  const atRowI = point.i;
  const atColJ = point.j;
  // const rightKey = `${atRowI + 1}-${atColJ}`;
  // if (atRowI < positions.length - 1) {
  //   validPositions.push({
  //     i: atRowI + 1,
  //     j: atColJ,
  //     key: rightKey,
  //   });
  // }
  // const downKey = `${atRowI}-${atColJ + 1}`;
  // if (atColJ < positions[0].length - 1) {
  //   validPositions.push({
  //     i: atRowI,
  //     j: atColJ + 1,
  //     key: downKey,
  //   });
  // }
  const upKey = `${atRowI}-${atColJ - 1}`;
  if (atColJ > 0) {
    validPositions.push({
      i: atRowI,
      j: atColJ - 1,
      key: upKey,
    });
  }
  const leftKey = `${atRowI - 1}-${atColJ}`;
  if (atRowI > 0) {
    validPositions.push({
      i: atRowI - 1,
      j: atColJ,
      key: leftKey,
    });
  }
  return validPositions;
}

function traverseForRisk(point, positions, shortestPathByPosition) {
  if (point.i === 0 && point.j === 0) {
    return 0;
  }

  if (shortestPathByPosition[point.key]) {
    return shortestPathByPosition[point.key];
  }

  const validPaths = getValidPositions(point, positions);
  if (!validPaths.length) {
    return failedPath;
  }

  let currentBestRisk = failedPath;
  for (let k = 0; k < validPaths.length; k++) {
    const p = validPaths[k];
    const resultingRisk = traverseForRisk(p, positions, shortestPathByPosition);
    if (resultingRisk < currentBestRisk) {
      currentBestRisk = resultingRisk;
    }
  }
  const risk = currentBestRisk + positions[point.i][point.j];
  shortestPathByPosition[point.key] = risk;
  return risk;
}

function partOne(positions) {
  const lastI = positions.length - 1;
  const lastJ = positions[0].length - 1;
  const lastKey = `${lastI}-${lastJ}`;
  const lowestRisk = traverseForRisk(
    { i: lastI, j: lastJ, key: lastKey },
    positions,
    {}
  );
  console.log(lowestRisk);
}

function partTwo(polymerTemplate, rules, depth) {}

function getSampleLines() {
  return [
    "1163751742",
    "1381373672",
    "2136511328",
    "3694931569",
    "7463417111",
    "1319128137",
    "1359912421",
    "3125421639",
    "1293138521",
    "2311944581",
  ];
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  const numberLines = lines
    // const numberLines = getSampleLines()
    .filter((l) => !!l)
    .map((l) => l.split("").map((c) => parseInt(c, 10)));
  partOne(numberLines);
  // partTwo(numberLines);
}

main().then(
  () => {
    console.log("Done!");
  },
  (e) => {
    console.error(e);
    console.error(e.stack);
  }
);
