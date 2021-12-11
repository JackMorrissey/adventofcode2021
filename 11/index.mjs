import { readFile } from "fs/promises";

function applyToGrid(octGrid, applyFunction) {
  for (let i = 0; i < octGrid.length; i++) {
    for (let j = 0; j < octGrid[i].length; j++) {
      octGrid[i][j] = applyFunction(octGrid[i][j], i, j);
    }
  }
}

function printGrid(octGrid, info) {
  console.log("grid at " + info);
  for (let i = 0; i < octGrid.length; i++) {
    console.log(octGrid[i].map((c) => c.energy).join(""));
  }
}

function getAdjacentCells(octGrid, i, j) {
  const adjacent = [];
  if (j > 0) {
    adjacent.push(octGrid[i][j - 1]);
  }
  if (j + 1 < octGrid[i].length) {
    adjacent.push(octGrid[i][j + 1]);
  }
  if (i > 0) {
    adjacent.push(octGrid[i - 1][j]);
    if (j > 0) {
      adjacent.push(octGrid[i - 1][j - 1]);
    }
    if (j + 1 < octGrid[i].length) {
      adjacent.push(octGrid[i - 1][j + 1]);
    }
  }
  if (i + 1 < octGrid.length) {
    adjacent.push(octGrid[i + 1][j]);
    if (j > 0) {
      adjacent.push(octGrid[i + 1][j - 1]);
    }
    if (j + 1 < octGrid[i].length) {
      adjacent.push(octGrid[i + 1][j + 1]);
    }
  }
  return adjacent;
}

function simulateStep(octGrid) {
  applyToGrid(octGrid, (cell) => {
    try {
      cell.energy++;
      cell.adjacentFlashes = new Set();
      cell.hasFlashed = false;
      cell.naturalFlash = cell.energy == 10;
      return cell;
    } catch (e) {
      throw e;
    }
  });

  const hasFlashedSet = new Set();
  let unstable = true;
  while (unstable) {
    unstable = false;

    applyToGrid(octGrid, (cell, i, j) => {
      try {
        if (hasFlashedSet.has(cell.id)) {
          return cell;
        }
        if (cell.energy > 9) {
          cell.hasFlashed = true;
          cell.energy = 0;
          hasFlashedSet.add(cell.id);
          unstable = true;
          return cell;
        }

        const adjacent = getAdjacentCells(octGrid, i, j);
        const newFlashes = adjacent.filter(
          (a) => a.hasFlashed && !cell.adjacentFlashes.has(a.id)
        );
        if (!newFlashes.length) {
          return cell;
        }

        cell.energy += newFlashes.length;
        newFlashes.forEach((a) => cell.adjacentFlashes.add(a.id));
        unstable = true;
        return cell;
      } catch (e) {
        throw e;
      }
    });
  }

  return hasFlashedSet.size;
}

function partOne(octGrid) {
  let flashedCount = 0;
  for (let i = 0; i < 100; i++) {
    flashedCount += simulateStep(octGrid);
  }
  console.log(flashedCount);
}

function partTwo(octGrid) {
  // hmm first try I got 168 but that's wrong...
  // oh wow. I was running partOne and then partTwo on the same grid. wowwwww. that costs like 30 min
  let flashedCount = 0;
  const octCount = octGrid.length * octGrid[0].length;
  let i = 0;
  let syncFlash = false;
  printGrid(octGrid, "" + 0 + " " + (syncFlash ? "sync" : "no sync"));
  while (flashedCount < octCount) {
    i++;
    flashedCount = simulateStep(octGrid);
    syncFlash = octGrid.every((i) => i.every((c) => c.naturalFlash));
    if (flashedCount == octCount) {
      printGrid(octGrid, "" + i + " " + (syncFlash ? "sync" : "no sync"));
    }
    // if (i < 11 || i % 10 == 0) {
    //   printGrid(octGrid, "" + i + " " + (syncFlash ? "sync" : "no sync"));
    // }
  }
  console.log(i, flashedCount);
}

function getTestDataAsLines() {
  return [
    "5483143223",
    "2745854711",
    "5264556173",
    "6141336146",
    "6357385478",
    "4167524645",
    "2176841721",
    "6882881134",
    "4846848554",
    "5283751526",
  ];
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  // const lines = getTestDataAsLines();
  const octGrid = lines
    .filter((v) => v !== "")
    .map((v, rowIndex) =>
      v.split("").map((d, heightIndex) => {
        return {
          energy: parseInt(d, 10),
          id: `${rowIndex},${heightIndex}`,
          hasFlashed: false,
        };
      })
    );
  //partOne(octGrid);
  partTwo(octGrid);
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
