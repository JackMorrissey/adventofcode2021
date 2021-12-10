import { readFile } from "fs/promises";

function partOne(entries) {
  const easyNumbersOutputs = entries
    .map((e) => e.outputs.map((o) => segmentLengthToNumber(o.length)))
    .flat()
    .reduce((p, c) => p + (!!c ? 1 : 0), 0);
  console.log(easyNumbersOutputs);
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

function signalToWires(signal) {
  let wires = signal.split("");
  wires.sort();
  return wires;
}

function getWirePositions(signals) {
  // solve for the
  /*
    🔝 
  ↖️ ↗️
    🔛
  ↙️ ↘️
    ⬇️

  */
  const found1 = signals.find((s) => s.length === 2);
  const found1Wires = signalToWires(found1);
  const found7 = signals.find((s) => s.length === 3);
  const found7Wires = signalToWires(found7);
  const topWire = found7Wires.find(
    (pieceOf7) => !found1Wires.includes(pieceOf7)
  );
  const the3ThatHave6Wires = signals.filter((s) => s.length === 6); // 0 6 9

  // 6 is the only one that doesn't have both wires from 1
  const found6 = the3ThatHave6Wires.find((h) => {
    const hWires = signalToWires(h);
    return !found1Wires.every((w1) => hWires.includes(w1));
  });
  const found6Wires = signalToWires(found6);
  const bottomRightWire = found1Wires.find((w) => found6Wires.includes(w));
  const topRightWire = found1Wires.find((w) => !found6Wires.includes(w));

  const stillUnsolved0and9 = the3ThatHave6Wires.filter((f) => f != found6);
  const found4 = signals.find((s) => s.length === 4);
  const found4Wires = signalToWires(found4);
  const found9 = stillUnsolved0and9.find((u) =>
    found4Wires.every((w) => signalToWires(u).includes(w))
  );
  const found0 = stillUnsolved0and9.find((f) => f != found9);

  // I think that's it? Compare to 8 and solve for all wires

  const found0Wires = signalToWires(found0);
  const found9Wires = signalToWires(found9);

  const found8 = signals.find((s) => s.length === 7);
  const found8Wires = signalToWires(found8);

  const middleWire = found8Wires.find((w8) => !found0Wires.includes(w8));
  const bottomLeftWire = found8Wires.find((w8) => !found9Wires.includes(w8));

  const topLeftWire = found4Wires.find(
    (w) => ![topRightWire, middleWire, bottomRightWire].includes(w)
  );

  const bottomWire = found8Wires.find(
    (w) =>
      ![
        topWire,
        topLeftWire,
        topRightWire,
        middleWire,
        bottomLeftWire,
        bottomRightWire,
      ].includes(w)
  );

  return [
    topWire,
    topLeftWire,
    topRightWire,
    middleWire,
    bottomLeftWire,
    bottomRightWire,
    bottomWire,
  ];
}

function getOutputNumber(output, wirePositions) {
  const [
    topWire,
    topLeftWire,
    topRightWire,
    middleWire,
    bottomLeftWire,
    bottomRightWire,
    bottomWire,
  ] = wirePositions;

  const justByLength = segmentLengthToNumber(output.length);
  if (justByLength) {
    return justByLength;
  }

  const wires = signalToWires(output);
  if (wires.length === 5) {
    if (!wires.includes(bottomRightWire)) {
      return 2;
    }
    if (wires.includes(topRightWire)) {
      return 3;
    }
    return 5;
  }
  if (wires.length === 6) {
    if (!wires.includes(middleWire)) {
      return 0;
    }
    if (!wires.includes(topRightWire)) {
      return 6;
    }
    return 9;
  }
  throw new Error("hmm.. what have I done?!");
}

function partTwo(entries) {
  const numbers = entries.map((e) => {
    const wirePositions = getWirePositions(e.signals);
    const result = e.outputs.map((o) => getOutputNumber(o, wirePositions));
    return parseInt(
      result.reduce((p, c) => p + c, ""),
      10
    );
  });
  const sum = numbers.reduce((p, c) => p + c, 0);
  console.log(sum);
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  // const lines = [
  //   "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf",
  // ];
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
