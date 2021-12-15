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
  console.log("total letters", nextPolymerTemplateLetters.length);
  const charCounts = getCharCounts(nextPolymerTemplateLetters);
  console.log(JSON.stringify(charCounts));
  const max = Math.max(...Object.values(charCounts));
  const min = Math.min(...Object.values(charCounts));
  console.log(max - min);
}

function splitTemplates(polymerTemplateLetters) {
  const templates = [];
  let middle = polymerTemplateLetters.length / 2;
  if (polymerTemplateLetters.length % 2 == 1) {
    middle = (polymerTemplateLetters.length - 1) / 2;
  }
  templates.push(polymerTemplateLetters.slice(0, middle));
  templates.push(polymerTemplateLetters.slice(middle));
  return templates;
}

function incrementCount(counts, c) {
  if (!counts[c]) {
    counts[c] = 0;
  }
  counts[c]++;
}

function processToAdditionalTemplates(
  letters,
  rules,
  counts = {},
  remainingSteps = 40
) {
  if (remainingSteps == 0) {
    return;
  }
  for (let i = 0; i < letters.length; i++) {
    if (i < letters.length - 1) {
      const pairRight = `${letters[i]}${letters[i + 1]}`;
      processToAdditionalTemplates(
        [letters[i], rules[pairRight]],
        rules,
        counts,
        remainingSteps - 1
      );
    }
    if (i > 0) {
      const pairLeft = `${letters[i - 1]}${letters[i]}`;
      incrementCount(counts, rules[pairLeft]);
      processToAdditionalTemplates(
        [rules[pairLeft], letters[i]],
        rules,
        counts,
        remainingSteps - 1
      );
    }
  }
}

function partTwoFailSameHeap(polymerTemplate, rules) {
  let nextPolymerTemplateLetters = polymerTemplate.split("");

  let templates = splitTemplates(nextPolymerTemplateLetters);
  for (let i = 0; i < 40; i++) {
    console.log(i, templates.length);
    let nextTemplates = [];
    for (let j = 0; j < templates.length; j++) {
      if (j > 0) {
        const connectingChars = [templates[j - 1][templates[j - 1].length - 1]];
        connectingChars.push(templates[j][0]);
        const result = process(connectingChars, rules);
        if (result.length == 3) {
          nextTemplates[nextTemplates.length - 1].push(result[1]);
        }
      }
      const processed = process(templates[j], rules);
      if (processed.length > 2500) {
        nextTemplates = nextTemplates.concat(splitTemplates(processed));
      } else {
        nextTemplates.push(processed);
      }
    }
    templates = nextTemplates;
  }
  const charCounts = getCharCounts(nextPolymerTemplateLetters);
  const max = Math.max(...Object.values(charCounts));
  const min = Math.min(...Object.values(charCounts));
  console.log(max - min);
}

function partTwo(polymerTemplate, rules) {
  let counts = {};
  let nextPolymerTemplateLetters = polymerTemplate.split("");
  nextPolymerTemplateLetters.forEach((c) => incrementCount(counts, c));
  processToAdditionalTemplates(nextPolymerTemplateLetters, rules, counts, 40);
  const max = Math.max(...Object.values(counts));
  const min = Math.min(...Object.values(counts));
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

  partOne(polymerTemplate, rules);
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
