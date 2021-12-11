import { readFile } from "fs/promises";

const chunkStarts = new Set(["(", "[", "{", "<"]);
const chunkEnds = new Set([")", "]", "}", ">"]);

function isChunkStart(c) {
  return chunkStarts.has(c);
}

function isChunkEnd(c) {
  return chunkEnds.has(c);
}

function isCorrectChunkEnd(start, end) {
  switch (start) {
    case "(":
      return end == ")";
    case "[":
      return end == "]";
    case "{":
      return end == "}";
    case "<":
      return end == ">";
    default:
      throw new Error(
        "do you even code, bro? chunkEnd for " + start + ", " + end
      );
  }
}

function getIllegalCharacterScore(c) {
  switch (c) {
    case ")":
      return 3;
    case "]":
      return 57;
    case "}":
      return 1197;
    case ">":
      return 25137;
    default:
      throw new Error("do you even code, bro? charScore for " + c);
  }
}

function getLineInsights(lineOfCharacters) {
  const chunkStack = [];
  const characters = lineOfCharacters;
  for (let j = 0; j < characters.length; j++) {
    var c = characters[j];
    if (isChunkStart(c)) {
      chunkStack.push(c);
    } else if (isChunkEnd(c)) {
      const lastChunkStart = chunkStack.pop();
      if (!isCorrectChunkEnd(lastChunkStart, c)) {
        return {
          corrupt: true,
          illegalCharacter: c,
        };
      }
    } else {
      throw new Error(
        "Unexpected character. Alert the crabs we must create a new hole"
      );
    }
  }
  return {
    corrupt: false,
    incomplete: !!chunkStack.length,
    incompleteStack: chunkStack,
  };
}

function partOne(linesOfCharacters) {
  const insights = linesOfCharacters.map(getLineInsights);
  const corrupted = insights.filter((i) => i.corrupt);
  const totalSyntaxErrorScore = corrupted.reduce(
    (prev, curr) => prev + getIllegalCharacterScore(curr.illegalCharacter),
    0
  );
  console.log(totalSyntaxErrorScore);
}

function getCharacterAutocompleteScore(chunkStart) {
  // assumes we'd just put the end chunk on there, but skips a step
  switch (chunkStart) {
    case "(":
      return 1;
    case "[":
      return 2;
    case "{":
      return 3;
    case "<":
      return 4;
    default:
      throw new Error(
        "do you even code, bro? autocomplete score for " + chunkStart
      );
  }
}
function partTwo(linesOfCharacters) {
  const insights = linesOfCharacters.map(getLineInsights);
  const incomplete = insights.filter((i) => i.incomplete);

  const autocompleteScores = incomplete.map((i) =>
    i.incompleteStack
      .reverse()
      .reduce((prev, curr) => prev * 5 + getCharacterAutocompleteScore(curr), 0)
  );
  autocompleteScores.sort(function (a, b) {
    return a - b;
  });
  const halfIndex = (autocompleteScores.length - 1) / 2;
  console.log(autocompleteScores[halfIndex]);
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  const linesOfCharacters = lines
    .filter((v) => v !== "")
    .map((v) => v.split(""));
  partOne(linesOfCharacters);
  partTwo(linesOfCharacters);
}

main().then(
  () => {
    console.log("Done!");
  },
  (e) => {
    console.error(e);
  }
);
