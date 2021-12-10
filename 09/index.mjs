import { readFile } from "fs/promises";

function partOne(heightGrid) {
  const lowPoints = [];
  for (let i = 0; i < heightGrid.length; i++) {
    const row = heightGrid[i];
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      const adjacent = [];
      if (j > 0) {
        adjacent.push(row[j - 1]);
      }
      if (j + 1 < row.length) {
        adjacent.push(row[j + 1]);
      }
      if (i > 0) {
        adjacent.push(heightGrid[i - 1][j]);
      }
      if (i + 1 < heightGrid.length) {
        adjacent.push(heightGrid[i + 1][j]);
      }
      const isLowPoint = adjacent.every((a) => cell < a);
      if (isLowPoint) {
        lowPoints.push(cell);
      }
    }
  }
  const sumOfRiskLevels = lowPoints.reduce((prev, cur) => prev + cur + 1, 0);
  console.log(sumOfRiskLevels);
}

function partTwo(heightGrid) {
  // mark the low points, then just iterate finding siblings and fill them in
  const basinsToSize = [];
  const basinWall = -1337;
  const unknownBasin = -1;
  let nextBasinId = 0;
  const basinGrid = [];

  // init basinGrid
  for (let i = 0; i < heightGrid.length; i++) {
    basinGrid.push([]);
    const row = heightGrid[i];
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      if (cell === 9) {
        basinGrid[i].push(basinWall);
        continue;
      }

      const adjacent = [];
      if (j > 0) {
        adjacent.push(row[j - 1]);
      }
      if (j + 1 < row.length) {
        adjacent.push(row[j + 1]);
      }
      if (i > 0) {
        adjacent.push(heightGrid[i - 1][j]);
      }
      if (i + 1 < heightGrid.length) {
        adjacent.push(heightGrid[i + 1][j]);
      }
      const isLowPoint = adjacent.every((a) => cell < a);
      if (isLowPoint) {
        basinGrid[i].push(nextBasinId);
        basinsToSize.push(1);
        nextBasinId++;
      } else {
        basinGrid[i].push(unknownBasin);
      }
    }
  }

  let unstable = true;
  while (unstable) {
    unstable = false;
    for (let i = 0; i < basinGrid.length; i++) {
      const row = basinGrid[i];
      const basinGridRow = basinGrid[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        if (cell > unknownBasin || cell === basinWall) {
          continue;
        }
        const adjacent = [];
        if (j > 0) {
          adjacent.push(row[j - 1]);
        }
        if (j + 1 < basinGridRow.length) {
          adjacent.push(row[j + 1]);
        }
        if (i > 0) {
          adjacent.push(basinGrid[i - 1][j]);
        }
        if (i + 1 < basinGrid.length) {
          adjacent.push(basinGrid[i + 1][j]);
        }
        const inBasin = adjacent.find((a) => a > unknownBasin);
        if (inBasin === undefined) {
          continue;
        }
        unstable = true;
        basinsToSize[inBasin]++;
        basinGrid[i][j] = inBasin;
      }
    }
  }
  // const sumOfRiskLevels = lowPoints.reduce((prev, cur) => prev + cur + 1, 0);
  console.log(basinGrid, basinsToSize);
  // hacky but whatever
  const sorted = [...basinsToSize];
  sorted.sort(function (a, b) {
    return a - b;
  });
  console.log(
    sorted[sorted.length - 3] *
      sorted[sorted.length - 2] *
      sorted[sorted.length - 1]
  );
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  const heightGrid = lines
    .filter((v) => v !== "")
    .map((v) => v.split("").map((d) => parseInt(d, 10)));
  partOne(heightGrid);
  partTwo(heightGrid);
}

main().then(
  () => {
    console.log("Done!");
  },
  (e) => {
    console.error(e);
  }
);
