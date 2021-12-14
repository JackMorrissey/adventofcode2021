import { readFile } from "fs/promises";

function getUniqueDots(dotsPrior) {
  const alreadyFound = new Set();
  const dots = [];
  dotsPrior.forEach((dot) => {
    if (!alreadyFound.has(`${dot.x}-${dot.y}`)) {
      dots.push(dot);
    }
    alreadyFound.add(`${dot.x}-${dot.y}`);
  });
  return dots;
}

function fold(dotsPrior, fold) {
  return dotsPrior.map((dot) => {
    if (fold.horizontal) {
      const diffY = Math.abs(fold.line - dot.y);
      return {
        x: dot.x,
        y: fold.line - diffY,
      };
    }
    const diffX = Math.abs(dot.x - fold.line);
    return {
      y: dot.y,
      x: fold.line - diffX,
    };
  });
}

function partOne(dots, folds) {
  console.log(dots, folds);
  const folded = fold(dots, folds[0]);
  const unique = getUniqueDots(folded);
  console.log(unique.length);
}

function draw(dots) {
  const toDraw = {};
  let maxX = 0;
  let maxY = 0;
  dots.forEach((dot) => {
    if (dot.x > maxX) {
      maxX = dot.x;
    }
    if (dot.y > maxY) {
      maxY = dot.y;
    }
    if (!toDraw[dot.y]) {
      toDraw[dot.y] = new Set();
    }
    toDraw[dot.y].add(dot.x);
  });
  for (let i = 0; i < maxY + 1; i++) {
    let line = [];
    for (let j = 0; j < maxX + 1; j++) {
      if (toDraw[i] && toDraw[i].has(j)) {
        line.push("#");
      } else {
        line.push(".");
      }
    }
    console.log(line.join(""));
  }
}

function partTwo(dots, folds) {
  const fullFolded = folds.reduce((prevDots, nextFold) => {
    return getUniqueDots(fold(prevDots, nextFold));
  }, dots);
  console.log(fullFolded);
  draw(fullFolded);
}

const testDataLines = [
  "6,10",
  "0,14",
  "9,10",
  "0,3",
  "10,4",
  "4,11",
  "6,0",
  "6,12",
  "4,1",
  "0,13",
  "10,12",
  "3,4",
  "3,0",
  "8,4",
  "1,10",
  "2,14",
  "8,10",
  "9,0",
  "",
  "fold along y=7",
  "fold along x=5",
];

function drawTestData(dots, folds) {
  console.log(dots, folds);
  const folded = fold(dots, folds[0]);
  const unique = getUniqueDots(folded);
  console.log(unique.length);
  const folded2 = fold(unique, folds[1]);
  const unique2 = getUniqueDots(folded2);
  draw(unique2);
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  // const lines = testDataLines;
  const dots = lines
    .filter((v) => v !== "" && !v.startsWith("fold"))
    .map((v) => {
      const coords = v.split(",");
      return {
        x: parseInt(coords[0], 10),
        y: parseInt(coords[1], 10),
      };
    });
  const folds = lines
    .filter((v) => v.startsWith("fold"))
    .map((v) => {
      let fold = v.replace("fold along ", "");
      if (fold.startsWith("x=")) {
        return {
          horizontal: false,
          line: parseInt(fold.replace("x=", ""), 10),
        };
      }
      return {
        horizontal: true,
        line: parseInt(fold.replace("y=", ""), 10),
      };
    });

  // partOne(dots, folds);
  partTwo(dots, folds);
  // drawTestData(dots, folds);
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
