const W = 11;
const H = 5;

const choices = createMatrix();

function parseTiles(letters, tiles) {
  return letters.map((letter, index) =>
    tiles[index].reduce((acc, row, y) => {
      return acc.concat(
        row.split("").reduce((innerAcc, cell, x) => {
          if (cell === letter) {
            innerAcc.push([x, y]);
          }
          return innerAcc;
        }, [])
      );
    }, [])
  );
}

function normalize(tile) {
  const dx = Math.min(...tile.map(([x, y]) => x));
  const dy = Math.min(...tile.map(([x, y]) => y));
  return tile.map(([x, y]) => [x - dx, y - dy]);
}

function flip(tile) {
  return tile.map(([x, y]) => [y, x]);
}

function rotate(tile, nRotations) {
  for (let i = 0; i < nRotations; i++) {
    tile = tile.map(([x, y]) => [y, -x]);
  }
  return tile;
}

function allRotationsAndFlips(tile, optimize) {
  /*
                if (optimize) {
            return new Set([normalize(rotate(tile, n)) for (const n of [0, 1])]);
        */

  if (optimize) {
    const rotationsAndFlips = new Set();
    for (let n = 0; n < 2; n++) {
      rotationsAndFlips.add(normalize(rotate(tile, n)));
    }
    console.log("optimize");
    return rotationsAndFlips;
  }

  const flippedTile = flip(tile);
  const rotatedFlips = [];
  for (const currentTile of [tile, flippedTile]) {
    for (let n = 0; n < 4; n++) {
      rotatedFlips.push(normalize(rotate(currentTile, n)));
    }
  }
  return new Set(rotatedFlips);
}

function offset(tile, dx, dy) {
  return tile.map(([x, y]) => [x + dx, y + dy]);
}

function* generateAllPositions(tile, optimize) {
  for (const currentTile of allRotationsAndFlips(tile, tile[0][0] === "A")) {
    const tileW = Math.max(...currentTile.map(([x, y]) => x));
    const tileH = Math.max(...currentTile.map(([x, y]) => y));
    for (let dx = 0; dx < W - tileW; dx++) {
      for (let dy = 0; dy < H - tileH; dy++) {
        yield offset(currentTile, dx, dy);
      }
    }
  }
}

function* makeChoices(letter, letters, tile) {
  const letterCols = letters.map((c) => (letter === c ? 1 : 0));
  for (const currentTile of generateAllPositions(tile, letter === "A")) {
    const tileCols = new Array(W * H).fill(0);
    for (const [x, y] of currentTile) {
      tileCols[y * W + x] = 1;
    }
    yield [...letterCols, ...tileCols];
  }
}

function makeAllChoices(letters, tiles) {
  const choices = [];
  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    const tile = tiles[i];
    for (const choice of makeChoices(letter, letters, tile)) {
      choices.push([letter, choice]);
    }
  }
  return choices;
}

function createMatrix() {
  const tiles = [
    ["AAA", "A A"],
    ["  BB", "BBB"],
    [" C", "CC", " CC"],
    [" D", "DDD"],
    [" E", "EEEE"],
    [" FF", "FFF"],
    [" GG", "GG "],
    ["HH", "H", "H"],
    ["III", "  I", "  I"],
    ["J", "JJJJ"],
    ["K", "KK"],
    ["LL", " LL", "  L"],
  ];
  const letters = tiles.map((tile) => tile[0].trim()[0]);
  const parsedTiles = parseTiles(letters, tiles);
  return makeAllChoices(letters, parsedTiles);
}

function minNumOnes(matrix, rows, columns) {
  let minColumn = -1;
  let minValue = 10000;
  for (const column of columns) {
    let numOnes = 0;
    for (const row of rows) {
      if (matrix[row][column]) {
        numOnes++;
        if (numOnes >= minValue) {
          break;
        }
      }
    }
    if (numOnes <= 1) {
      return [column, numOnes];
    }
    if (numOnes < minValue) {
      minColumn = column;
      minValue = numOnes;
    }
  }
  return [minColumn, minValue];
}

function recurse(matrix, rows, columns, solutions, partialSolution) {
  if (columns.size === 0) {
    solutions.push([...partialSolution]);
    printSolution(choices, partialSolution);
    return;
  }

  if (solutions.length > 90000) {
    return;
  }

  const [selectedCol, minValue] = minNumOnes(matrix, rows, columns);
  if (minValue === 0) {
    return;
  }

  const candidateRows = [];
  for (const row of rows) {
    if (matrix[row][selectedCol]) {
      candidateRows.push(row);
    }
  }

  for (const candidateRow of candidateRows) {
    const columnsToRemove = new Set();
    for (const column of columns) {
      if (matrix[candidateRow][column]) {
        columnsToRemove.add(column);
      }
    }
    const rowsToRemove = new Set();
    for (const col of columnsToRemove) {
      for (const row of rows) {
        if (matrix[row][col]) {
          rowsToRemove.add(row);
        }
      }
    }
    const newRows = new Set([...rows].filter((row) => !rowsToRemove.has(row)));
    const newColumns = new Set(
      [...columns].filter((column) => !columnsToRemove.has(column))
    );
    recurse(matrix, newRows, newColumns, solutions, [
      ...partialSolution,
      candidateRow,
    ]);
  }
}

function printSolution(choices, solution) {
  const solutionRows = solution.map((row) => choices[row]);
  const numLetters = choices[0][1].length - W * H;
  const flatMap = new Array(W * H).fill(" ");

  for (const [letter, row] of solutionRows) {
    for (let i = 0; i < W * H; i++) {
      if (row[numLetters + i] === 1) {
        flatMap[i] = letter;
      }
    }
  }

  let boardArray = [];

  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      row.push(flatMap[y * W + x]);
    }
    boardArray.push(row);
  }
  self.postMessage(boardArray);
}

function main() {
  const matrix = choices.map((row) => row[1]);

  const rows = new Set([...Array(matrix.length).keys()]);
  const columns = new Set([...Array(matrix[0].length).keys()]);

  const solutions = [];
  recurse(matrix, rows, columns, solutions, []);

  for (const solution of solutions) {
    printSolution(choices, solution);
  }
}

self.onmessage = function (event) {
  const message = event.data;

  console.log("message");
  console.log(message);
  main();
};
