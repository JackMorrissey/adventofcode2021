import { readFile } from "fs/promises";

function getLineAsInts(line, token = ' ') {
  return line.split(token).filter((v) => !!v).map(v => parseInt(v, 10));
}

function getBoards(lines) {
  const boards = [];
  let board = [];
  for(let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      if (board.length) {
        boards.push(board);
        board = [];
      }
      continue;
    }
    board.push(getLineAsInts(line));
  }
  if (board.length) {
    // last one if the input doesn't end in a space
    boards.push(board);
    board = [];
  }
  return boards;
}

/**
 * Returns the number of turns until the board wins. 0 if it never wins
 * @param drawnNumbers 
 * @param board 
 */
function turnsToWin(drawnNumbers, board) {
  const width = board[0].length;
  const height = board.length;
  let minToWin = Math.min(width, height);
  let numberOfTurns = minToWin;
  for(let i = minToWin; i < drawnNumbers.length; i++) {
    numberOfTurns = i;
    const pickedNumbers = new Set(drawnNumbers.slice(0, numberOfTurns));
    // by rows
    for(let r = 0; r < height; r++) {
      const row = board[r];
      if (row.every((v) => pickedNumbers.has(v))) {
        return numberOfTurns;
      }
    }
    // columns
    for(let c = 0; c < width; c++) {
      const column = board.map(l => l[c]);
      if (column.every((v) => pickedNumbers.has(v))) {
        return numberOfTurns;
      }
    }
  }
  // apparently every board wins eventually and this never happens. That's nice.
  return 0;
}

function calculateBoardScore(drawnNumbers, boardWithTurns) {
  const pickedNumbers = new Set(drawnNumbers.slice(0, boardWithTurns.turns));
  const numberJustCalled = drawnNumbers[boardWithTurns.turns-1];
  const boardNumbers = boardWithTurns.board.flat();
  const unmarkedNumbers = boardNumbers.filter(x => !pickedNumbers.has(x));
  const unmarkedSum = unmarkedNumbers.reduce((prev, curr) => prev + curr, 0)
  const score = unmarkedSum * numberJustCalled;
  return score;
}

function partOne(drawnNumbers, boards) {
  const turnsToBoard = boards.map((b) => {
    return {
      turns: turnsToWin(drawnNumbers, b),
      board: b
    }
  });
  const lowestTurnsWin = Math.min(...turnsToBoard.map(b => b.turns));
  const bestBoard = turnsToBoard.find(b => b.turns === lowestTurnsWin);
  console.log(lowestTurnsWin, bestBoard, 'bestboard')
  const boardScore = calculateBoardScore(drawnNumbers, bestBoard);
  console.log('best boardScore', boardScore);
}

function partTwo(drawnNumbers, boards) {
  const turnsToBoard = boards.map((b) => {
    return {
      turns: turnsToWin(drawnNumbers, b),
      board: b
    }
  });
  const longestTurnsWin = Math.max(...turnsToBoard.map(b => b.turns));
  const worstBoard = turnsToBoard.find(b => b.turns === longestTurnsWin);
  console.log(longestTurnsWin, worstBoard, 'worstBoard')
  const boardScore = calculateBoardScore(drawnNumbers, worstBoard);
  console.log('worst boardScore', boardScore);
}

async function main() {
  const contents = await readFile("input.txt", "utf8");
  const lines = contents.split("\n");
  const drawnNumbers = getLineAsInts(lines.splice(0, 1)[0], ',');
  const boards = getBoards(lines);
  partOne(drawnNumbers, boards);
  partTwo(drawnNumbers, boards);
}

main().then(
  () => {
    console.log("Done!");
  },
  (e) => {
    console.error(e);
  }
);
