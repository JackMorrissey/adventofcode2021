import { readFile } from "fs/promises";

function calculateLinearCost(positions, proposedLocation) {
  return positions.reduce(
    (prev, curr) => prev + Math.abs(curr - proposedLocation),
    0
  );
}

function partOne(horizontalPositions) {
  // brute force all positions
  const min = Math.min(...horizontalPositions);
  const max = Math.max(...horizontalPositions);
  let cheapestPosition = undefined;
  let cheapestCost = Number.MAX_SAFE_INTEGER;
  for (var i = min; i <= max; i++) {
    const cost = calculateLinearCost(horizontalPositions, i);
    if (cost < cheapestCost) {
      cheapestCost = cost;
      cheapestPosition = i;
    }
  }
  console.log(
    "cheapest position " + cheapestPosition + " at cost of " + cheapestCost
  );
}

function calculateSummation(distance) {
  // hmm is there really no summation function?
  // looks like I could make an array with the keys and then do a sum? meh.
  let cost = 0;
  while (distance) {
    cost += distance;
    distance--;
  }
  return cost;
}

function calculateSteppedCost(positions, proposedLocation) {
  return positions.reduce(
    (prev, curr) =>
      prev + calculateSummation(Math.abs(curr - proposedLocation)),
    0
  );
}

function partTwo(horizontalPositions) {
  // brute force all positions
  // could probably start at the median/mean and search out... but let's just keep brute forcing
  const min = Math.min(...horizontalPositions);
  const max = Math.max(...horizontalPositions);
  let cheapestPosition = undefined;
  let cheapestCost = Number.MAX_SAFE_INTEGER;
  for (var i = min; i <= max; i++) {
    const cost = calculateSteppedCost(horizontalPositions, i);
    if (cost < cheapestCost) {
      cheapestCost = cost;
      cheapestPosition = i;
    }
  }
  console.log(
    "part 2 cheapest position " +
      cheapestPosition +
      " at cost of " +
      cheapestCost
  );
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  const horizontalPositions = lines[0]
    .split(",")
    .filter((v) => v !== "")
    .map((v) => parseInt(v, 10));
  partOne(horizontalPositions);
  partTwo(horizontalPositions);
}

main().then(
  () => {
    console.log("Done!");
  },
  (e) => {
    console.error(e);
  }
);
