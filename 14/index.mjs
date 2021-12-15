import { readFile } from "fs/promises";

function process(polymerTemplateLetters, rules) {
  const letters = polymerTemplateLetters;
  let nextPolymerTemplateLetters = [letters[0]];
  for (let i = 1; i < letters.length; i++) {
    const pair = `${letters[i - 1]}${letters[i]}`;
    if (rules[pair]) {
      nextPolymerTemplateLetters.push(rules[pair]);
    }
    nextPolymerTemplateLetters.push(letters[i]);
  }
  return nextPolymerTemplateLetters;
}

function getCharCounts(polymerTemplate) {
  const counts = {};
  polymerTemplate.forEach((c) => {
    if (!counts[c]) {
      counts[c] = 0;
    }
    counts[c]++;
  });
  return counts;
}

function partOne(polymerTemplate, rules) {
  let nextPolymerTemplateLetters = polymerTemplate.split("");
  for (let i = 0; i < 10; i++) {
    nextPolymerTemplateLetters = process(nextPolymerTemplateLetters, rules);
  }
  const charCounts = getCharCounts(nextPolymerTemplateLetters);
  const max = Math.max(...Object.values(charCounts));
  const min = Math.min(...Object.values(charCounts));
  console.log(max - min);
}

function partTwo(polymerTemplate, rules) {
  let nextPolymerTemplateLetters = polymerTemplate.split("");
  for (let i = 0; i < 40; i++) {
    console.log(i);
    nextPolymerTemplateLetters = process(nextPolymerTemplateLetters, rules);
  }
  const charCounts = getCharCounts(nextPolymerTemplateLetters);
  const max = Math.max(...Object.values(charCounts));
  const min = Math.min(...Object.values(charCounts));
  console.log(max - min);
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  const polymerTemplate = lines[0];
  const rules = lines.slice(2).reduce((prev, l) => {
    const fromTo = l.split(" -> ");
    prev[fromTo[0]] = fromTo[1];
    return prev;
  }, {});

  // partOne(polymerTemplate, rules);
  partTwo(polymerTemplate, rules);
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
