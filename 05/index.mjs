import { readFile } from "fs/promises";

function getLineAsCoordinates(line) {
  return line.split(" -> ").map((v) => {
    const vals = v.split(",").map((v) => parseInt(v, 10));
    return {
      x: vals[0],
      y: vals[1],
    };
  });
}

function getCoordinateHash(coord) {
  return `${coord.x}-${coord.y}`;
}

function isHorizontalLine(coordLine) {
  return coordLine.every((c) => c.x === coordLine[0].x);
}

function isVerticalLine(coordLine) {
  return coordLine.every((c) => c.y === coordLine[0].y);
}

function coordsAreEqual(coordA, coordB) {
  return coordA.x === coordB.x && coordA.y === coordB.y;
}

function getExpandedLine(coordLine) {
  // kinda dicey for diagnals, but probably OOS
  // oh nice. dicey was for !45 degrees, but as guessed we got 45 degrees in part 2 :)
  const start = coordLine[0];
  const end = coordLine[coordLine.length - 1];
  const expanded = [start];
  let prior = start;
  while (!coordsAreEqual(prior, end)) {
    const next = { ...prior };
    if (end.x > prior.x) {
      next.x = prior.x + 1;
    } else if (end.x < prior.x) {
      next.x = prior.x - 1;
    }
    if (end.y > prior.y) {
      next.y = prior.y + 1;
    } else if (end.y < prior.y) {
      next.y = prior.y - 1;
    }
    expanded.push(next);
    prior = next;
  }
  return expanded;
}

function getFrequencies(expandedLines) {
  const frequencies = {};
  expandedLines.forEach((e) => {
    e.forEach((c) => {
      const hash = getCoordinateHash(c);
      if (!frequencies[hash]) {
        frequencies[hash] = 1;
      } else {
        frequencies[hash]++;
      }
    });
  });
  return frequencies;
}

function partOne(coordLines) {
  const horizontalOrVerticalLines = coordLines.filter(
    (c) => isVerticalLine(c) || isHorizontalLine(c)
  );
  const expanded = horizontalOrVerticalLines.map(getExpandedLine);
  const frequencies = getFrequencies(expanded);
  const overlap = Object.values(frequencies).filter((v) => v > 1).length;
  console.log(overlap + " overlaps");
}

function partTwo(coordLines) {
  const expanded = coordLines.map(getExpandedLine);
  const frequencies = getFrequencies(expanded);
  const overlap = Object.values(frequencies).filter((v) => v > 1).length;
  console.log(overlap + " part two overlaps");
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  const coordLines = lines.filter((l) => !!l).map(getLineAsCoordinates);
  partOne(coordLines);
  partTwo(coordLines);
}

main().then(
  () => {
    console.log("Done!");
  },
  (e) => {
    console.error(e);
  }
);
