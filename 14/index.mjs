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

function partOne(polymerTemplate, rules, depth) {
  let nextPolymerTemplateLetters = polymerTemplate.split("");
  for (let i = 0; i < depth; i++) {
    nextPolymerTemplateLetters = process(nextPolymerTemplateLetters, rules);
  }

  const counts = getCharCounts(nextPolymerTemplateLetters);
  console.log(JSON.stringify(counts));
  const max = Math.max(...Object.values(counts));
  const min = Math.min(...Object.values(counts));
  console.log(max - min);
  console.log("----");
}

function mergeCounts(countsA, countsB, countsC = {}) {
  const counts = { ...countsA };
  for (const [key, value] of Object.entries(countsB)) {
    if (!counts[key]) {
      counts[key] = value;
    } else {
      counts[key] += value;
    }
  }

  for (const [key, value] of Object.entries(countsC)) {
    if (!counts[key]) {
      counts[key] = value;
    } else {
      counts[key] += value;
    }
  }

  return counts;
}

function incrementCount(counts, c) {
  if (!counts[c]) {
    counts[c] = 0;
  }
  counts[c]++;
}

function processPair(leftChar, rightChar, remainingSteps, rules, countCache) {
  const pair = `${leftChar}${rightChar}`;
  const newChar = rules[pair];
  let counts = {
    [newChar]: 1,
  };
  if (remainingSteps == 0) {
    return counts;
  }
  const nextSteps = remainingSteps - 1;
  const cacheKey = `${pair}.${nextSteps}`;
  if (countCache[cacheKey]) {
    return countCache[cacheKey];
  }

  const totalCounts = mergeCounts(
    counts,
    processPair(leftChar, newChar, nextSteps, rules, countCache),
    processPair(newChar, rightChar, nextSteps, rules, countCache)
  );

  if (nextSteps > 5) {
    countCache[cacheKey] = totalCounts;
  }

  return totalCounts;
}

function time(start) {
  let end = new Date();
  let timeDiff = end - start; //in ms
  timeDiff /= 1000;
  let seconds = Math.round(timeDiff);
  console.log(seconds + " seconds");
}

function partTwo(polymerTemplate, rules, depth) {
  let counts = {};
  let countCache = {};
  let nextPolymerTemplateLetters = polymerTemplate.split("");
  nextPolymerTemplateLetters.forEach((c) => incrementCount(counts, c));
  const start = new Date();
  for (let i = 1; i < nextPolymerTemplateLetters.length; i++) {
    console.log(`Top ${i}/${nextPolymerTemplateLetters.length}`);
    const processed = processPair(
      nextPolymerTemplateLetters[i - 1],
      nextPolymerTemplateLetters[i],
      depth - 1,
      rules,
      countCache
    );
    counts = mergeCounts(counts, processed);
  }
  time(start);
  console.log(JSON.stringify(counts));
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

  const depth = 40;

  // partOne(polymerTemplate, rules, depth);
  partTwo(polymerTemplate, rules, depth);
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
