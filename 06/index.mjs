import { readFile } from "fs/promises";

let fishId = 0;

function createLanternFish(internalTimer, parentId = -1) {
  return {
    id: fishId++,
    internalTimer,
    timeTracked: 0,
    parentId,
  };
}

function simulateDay(lanternFish) {
  const parentIds = [];
  lanternFish.forEach((fish) => {
    fish.timeTracked++;
    if (fish.internalTimer) {
      fish.internalTimer--;
    } else {
      parentIds.push(fish.id);
      fish.internalTimer = 6;
    }
  });
  parentIds.forEach((pId) => {
    lanternFish.push(createLanternFish(8, pId));
  });
}

function partOne(nearbyAges) {
  let fish = nearbyAges.map(createLanternFish);
  for (let i = 0; i < 80; i++) {
    simulateDay(fish);
    console.log("day " + (i + 1) + " length " + fish.length);
  }
}

function partTwo(nearbyAges) {
  // amazing. this code is so slow it starts taking 10s of seconds on day 138.
  // I anticipated part 2 to be metadata, not speed. i'm wrong! that's awesome.
  // let fish = nearbyAges.map(createLanternFish);
  // for (let i = 0; i < 256; i++) {
  //   simulateDay(fish);
  //   console.log("part 2 day " + (i + 1) + " length " + fish.length);
  // }
  // ok i guess i'll do it better :)

  const ageCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  nearbyAges.forEach((a) => {
    ageCounts[a]++;
  });

  for (let i = 0; i < 256; i++) {
    const new6s = ageCounts[7] + ageCounts[0];
    ageCounts[7] = ageCounts[8];

    // yeah.. i'm gonna leave this. happy hackathon everyone
    ageCounts[8] = ageCounts[0];
    ageCounts[0] = ageCounts[1];
    ageCounts[1] = ageCounts[2];
    ageCounts[2] = ageCounts[3];
    ageCounts[3] = ageCounts[4];
    ageCounts[4] = ageCounts[5];
    ageCounts[5] = ageCounts[6];
    ageCounts[6] = new6s;
  }
  console.log(ageCounts.reduce((prev, curr) => prev + curr, 0));
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  const nearbyAges = lines[0]
    .split(",")
    .filter((v) => v !== "")
    .map((v) => parseInt(v, 10));
  partOne(nearbyAges);
  partTwo(nearbyAges);
}

main().then(
  () => {
    console.log("Done!");
  },
  (e) => {
    console.error(e);
  }
);
