import { readFile } from "fs/promises";

function canBeTraversedTwice(name) {
  return name.split("").every((c) => c == c.toUpperCase());
}

function findAllPaths(
  edgesMap,
  exploredEdges = new Set(),
  exploredNodes = ["start"],
  currentNode = "start"
) {
  if (currentNode == "end") {
    return [exploredNodes.join(",")];
  }
  const destinations = edgesMap[currentNode];
  let possibleDestinations = [...destinations].filter(
    (d) =>
      (canBeTraversedTwice(d) || !exploredNodes.includes(d)) &&
      // cycle detection
      !exploredEdges.has(`${currentNode}-${d}`)
  );
  if (!possibleDestinations.length) {
    return [];
  }
  return possibleDestinations
    .map((d) => {
      const newExploredEdges = new Set(exploredEdges);
      newExploredEdges.add(`${currentNode}-${d}`);
      return findAllPaths(
        edgesMap,
        newExploredEdges,
        [...exploredNodes, d],
        d
      ).flat();
    })
    .flat();
}

function partOne(edgesMap) {
  const allPaths = findAllPaths(edgesMap);
  console.log(allPaths.length);
}

function findAllPathsPart2(
  edgesMap,
  exploredEdges = new Set(),
  exploredNodes = ["start"],
  currentNode = "start",
  doubleSmallUsed = false
) {
  if (currentNode == "end") {
    return [exploredNodes.join(",")];
  }
  const destinations = edgesMap[currentNode];
  let possibleDestinations = [...destinations].filter(
    (d) =>
      d != "start" &&
      (canBeTraversedTwice(d) || !exploredNodes.includes(d) || !doubleSmallUsed)
  );
  if (!possibleDestinations.length) {
    return [];
  }
  return possibleDestinations
    .map((d) => {
      const newExploredEdges = new Set(exploredEdges);
      newExploredEdges.add(`${currentNode}-${d}`);
      return findAllPathsPart2(
        edgesMap,
        newExploredEdges,
        [...exploredNodes, d],
        d,
        doubleSmallUsed ||
          (!canBeTraversedTwice(d) && exploredNodes.includes(d))
      ).flat();
    })
    .flat();
}

function partTwo(edgesMap) {
  const allPaths = findAllPathsPart2(edgesMap);
  console.log(allPaths.length);
}

function getTestData1AsLines() {
  return ["start-A", "start-b", "A-c", "A-b", "b-d", "A-end", "b-end"];
}

function getTestData2AsLines() {
  return [
    "dc-end",
    "HN-start",
    "start-kj",
    "dc-start",
    "dc-HN",
    "LN-dc",
    "HN-end",
    "kj-sa",
    "kj-HN",
    "kj-dc",
  ];
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  // const lines = getTestData1AsLines();
  const edges = lines.filter((v) => v !== "").map((v) => v.split("-"));
  const edgesMap = {};
  edges.forEach((e) => {
    if (!edgesMap[e[0]]) {
      edgesMap[e[0]] = new Set();
    }
    if (!edgesMap[e[1]]) {
      edgesMap[e[1]] = new Set();
    }
    edgesMap[e[0]].add(e[1]);
    edgesMap[e[1]].add(e[0]);
  });
  partOne(edgesMap);
  partTwo(edgesMap);
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
