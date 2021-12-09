import { readFile } from "fs/promises";

function calculateLinearCost(positions, proposedLocation) {
  return positions.reduce(
    (prev, curr) => prev + Math.abs(curr - proposedLocation),
    0
  );
}

function partOne(entries) {
  const easyNumbersInOutputs = entries
    .map((e) => e.outputs.map((o) => segmentLengthToNumber(o.length)))
    .flat()
    .reduce((p, c) => p + (!!c ? 1 : 0), 0);
  console.log(easyNumbersInOutputs);
}

function segmentLengthToNumber(length) {
  switch (length) {
    case 2:
      return 1;
    case 3:
      return 7;
    case 4:
      return 4;
    case 7:
      return 8;
    default:
      return undefined;
  }
}

function partTwo() {}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  const entries = lines
    .filter((v) => v !== "")
    .map((v) => {
      const [signalPatternString, outputString] = v.split(" | ");
      return {
        signals: signalPatternString.split(" ").map((s) => s.trim()),
        outputs: outputString.split(" ").map((s) => s.trim()),
      };
    });
  partOne(entries);
  partTwo(entries);
}

main().then(
  () => {
    console.log("Done!");
  },
  (e) => {
    console.error(e);
  }
);
