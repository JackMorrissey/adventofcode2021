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

function getValidPositions(atRowI, atColJ, positions, visitedPositions) {
  const validPositions = [];
  const up = {
    i: atRowI - 1,
    j: atColJ,
  };
  const down = {
    i: atRowI + 1,
    j: atColJ,
  };
}

function traverseForRisk(
  atI,
  atJ,
  positions,
  visitedPositions,
  currentRisk,
  toBeatRisk
) {
  if (atI === positions.length - 1 && atJ === positions[0].length - 1) {
    return currentRisk;
  }

  if (currentRisk > toBeatRisk) {
    return failedPath;
  }

  // get valid paths
}

function partOne(numberLines) {
  const simpleRisk = getSimplePathRisk(numberLines);
  console.log(JSON.stringify(numberLines));
}

function partTwo(polymerTemplate, rules, depth) {
  const start = new Date();

  time(start);
  console.log(JSON.stringify(counts));
  const max = Math.max(...Object.values(counts));
  const min = Math.min(...Object.values(counts));
  console.log(max - min);
}

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
  const numberLines = getSampleLines() // lines
    .filter((l) => !!l)
    .map((l) => l.split("").map((c) => parseInt(c, 10)));
  partOne(numberLines);
  //partTwo(numberLines);
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
