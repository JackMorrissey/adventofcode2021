import { readFile } from "fs/promises";

async function partOne(commands) {
  let vertical = 0;
  let horizontal = 0;
  commands.forEach(c => {
      switch (c.command) {
        case "forward": 
          horizontal += c.value;
          break;
        case "down":
          vertical += c.value;
          break;
        case "up":
            vertical -= c.value;
      }
  });
  console.log(vertical * horizontal);

}

async function partTwo(commands) {
    let vertical = 0;
    let aim = 0;
    let horizontal = 0;
    commands.forEach(c => {
        switch (c.command) {
          case "forward": 
            horizontal += c.value;
            vertical += (aim * c.value)
            break;
          case "down":
            aim += c.value;
            break;
          case "up":
              aim -= c.value;
        }
    });
    console.log(vertical * horizontal);
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n").filter((v) => !!v);
  const commands = lines.map((l) => {
    const parts = l.split(" ");
    return {
      command: parts[0],
      value: parseInt(parts[1], 10),
    };
  });
  partOne(commands);
  partTwo(commands);
}

main().then(
  () => {
    console.log("Done!");
  },
  (e) => {
    console.error(e);
  }
);
