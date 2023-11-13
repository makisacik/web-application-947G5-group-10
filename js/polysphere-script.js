const rows = 5;
const cols = 11;

let boardArray = [];

let solutionsArray = [];
let currentSolutionIndex;

let isPieceAdded = false;
let addedPieceBoard = [];

let isWorkerActive = false;
let worker;

let piecesArray = [
  [
    ["A", "A", "A"],
    ["A", " ", "A"],
  ],
  [
    [" ", " ", "B", "B"],
    ["B", "B", "B"],
  ],
  [
    [" ", "C"],
    ["C", "C"],
    [" ", "C", "C"],
  ],
  [
    [" ", "D"],
    ["D", "D", "D"],
  ],
  [
    [" ", "E"],
    ["E", "E", "E", "E"],
  ],
  [
    [" ", "F", "F"],
    ["F", "F", "F"],
  ],
  [
    [" ", "G", "G"],
    ["G", "G", " "],
  ],
  [["H", "H"], ["H"], ["H"]],
  [
    ["I", "I", "I"],
    [" ", " ", "I"],
    [" ", " ", "I"],
  ],
  [["J"], ["J", "J", "J", "J"]],
  [["K"], ["K", "K"]],
  [
    ["L", "L"],
    [" ", "L", "L"],
    [" ", " ", "L"],
  ],
];

let rotationAngles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let piecesMirrorStates = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var selectedPieceIndex;

function initBoardArray() {
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(" ");
    }
    boardArray.push(row);
  }
  console.log(boardArray);
  for (let i = 0; i < rows; i++) {
    console.log(boardArray[i].join(" "));
  }
}

function addEventListenerToPuzzles() {
  const images = document.querySelectorAll(".pieces-container img");
  1;
  images.forEach((img) => {
    img.addEventListener("click", () => {
      if (img.classList.contains("highlighted")) {
        img.classList.remove("highlighted");
        selectedPiece = "";
      } else {
        images.forEach((i) => i.classList.remove("highlighted"));
        img.classList.add("highlighted");
        selectedPieceIndex = parseInt(img.id) - 1;
        console.log(selectedPieceIndex);
      }
    });
  });
}

function createPiecesContainer() {
  const container = document.getElementById("pieces-container");

  for (let i = 1; i <= 12; i++) {
    const img = document.createElement("img");
    img.id = `${i}`;
    img.src = `../resources/images/piece${i}.png`;
    img.alt = `piece ${i} png`;
    img.width = 100;
    img.height = 90;
    img.className = "piece-image";

    container.appendChild(img);
  }
}

function createBoard(boardArray) {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 11; col++) {
      const square = document.createElement("div");
      if (boardArray[row][col] == " ") {
        square.className = "square background";
      } else {
        square.className = `square ${boardArray[row][col]}`;
      }
      board.appendChild(square);
    }
  }
}

function addPieceClicked() {
  boardArray = [];
  solutionsArray = [];
  initBoardArray();
  const selectedPiece = piecesArray[selectedPieceIndex];
  let pieceRowIndex = 0;
  for (let row = rows - selectedPiece.length; row < 5; row++) {
    let pieceRow = selectedPiece[pieceRowIndex];
    console.log(pieceRow);
    for (let col = 0; col < pieceRow.length; col++) {
      boardArray[row][col] = pieceRow[col];
    }
    pieceRowIndex++;
  }
  console.log(boardArray);
  createBoard(boardArray);

  isPieceAdded = true;
  addedPieceBoard = boardArray;
}

function moveLeftClicked() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (boardArray[row][col] != " " && col > 0) {
        if (boardArray[row][col] != boardArray[row][col - 1]) {
          boardArray[row][col - 1] = boardArray[row][col];
          boardArray[row][col] = " ";
        }
      }
    }
  }
  createBoard(boardArray);
}

function moveRightClicked() {
  for (let row = 0; row < rows; row++) {
    for (let col = 10; col >= 0; col--) {
      if (boardArray[row][col] != " " && 10 > col) {
        boardArray[row][col + 1] = boardArray[row][col];
        boardArray[row][col] = " ";
      }
    }
  }
  createBoard(boardArray);
}

function moveUpClicked() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (boardArray[row][col] != " " && row > 0) {
        boardArray[row - 1][col] = boardArray[row][col];
        boardArray[row][col] = " ";
      }
    }
  }
  createBoard(boardArray);
}

function moveDownClicked() {
  for (let row = 4; row >= 0; row--) {
    for (let col = 0; col < cols; col++) {
      if (boardArray[row][col] != " " && row < 4) {
        boardArray[row + 1][col] = boardArray[row][col];
        boardArray[row][col] = " ";
      }
    }
  }
  createBoard(boardArray);
}

function is2DArrayInArray(arrayOf2DArrays, newArray) {
  for (const existingArray of arrayOf2DArrays) {
    if (arraysAreEqual(existingArray, newArray)) {
      return true;
    }
  }
  return false;
}

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!arr1[i].every((val, index) => val === arr2[i][index])) {
      return false;
    }
  }

  return true;
}

function isPieceArrayEqual(arr1, arr2) {
  if (arr1.length !== arr2.length || arr1[0].length !== arr2[0].length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr1[i].length; j++) {
      if (arr1[i][j] !== " " && arr1[i][j] !== arr2[i][j]) {
        return false;
      }
    }
  }

  return true;
}

function solvePuzzleClicked() {
  const buttonSolve = document.getElementById("button-solve");
  if (isWorkerActive) {
    buttonSolve.textContent = "Solve Puzzle";
    buttonSolve.style.backgroundColor = "#007BFF";
    isWorkerActive = false;
    worker.terminate();
  } else {
    const solutionLabel = document.getElementById("label-solution-count");
    const currentSolutionLabel = document.getElementById(
      "label-current-solution"
    );
    solutionLabel.textContent = "Solution Count: ";
    currentSolutionLabel.textContent = "Current Solution: ";

    isWorkerActive = true;
    buttonSolve.textContent = "Stop Solving";
    buttonSolve.style.backgroundColor = "red";

    currentSolutionIndex = -1;
    solutionsArray = [];
    worker = new Worker("../js/kanoodle-solver.js");

    worker.onmessage = function (event) {
      const solution = event.data;
      if (isPieceAdded) {
        if (!isPieceArrayEqual(addedPieceBoard, solution)) {
          return;
        }
      }

      if (!is2DArrayInArray(solutionsArray, solution)) {
        solutionsArray.push(solution);
      } else {
        console.log("exists");
      }
      solutionLabel.textContent = "Solution Count: " + solutionsArray.length;
      if (currentSolutionIndex == -1) {
        currentSolutionIndex = 0;

        currentSolutionLabel.textContent =
          "Current Solution: " + (currentSolutionIndex + 1);
        createBoard(solution);
      }
    };
  }

  worker.postMessage("Hello from the main thread!");
}

function nextSolutionClicked() {
  if (currentSolutionIndex == -1) {
    alert("You need to solve the puzzle first.");
  } else {
    currentSolutionIndex = currentSolutionIndex + 1;
    if (currentSolutionIndex < solutionsArray.length) {
      createBoard(solutionsArray[currentSolutionIndex]);
      const currentSolutionLabel = document.getElementById(
        "label-current-solution"
      );
      currentSolutionLabel.textContent =
        "Current Solution: " + (currentSolutionIndex + 1);
    } else {
      currentSolutionIndex = currentSolutionIndex - 1;
    }
  }
}

function previousSolutionClicked() {
  if (currentSolutionIndex == -1) {
    alert("You need to solve the puzzle first.");
  } else {
    currentSolutionIndex = currentSolutionIndex - 1;
    if (currentSolutionIndex >= 0) {
      createBoard(solutionsArray[currentSolutionIndex]);
      const currentSolutionLabel = document.getElementById(
        "label-current-solution"
      );
      currentSolutionLabel.textContent =
        "Current Solution: " + (currentSolutionIndex + 1);
    } else {
      currentSolutionIndex = currentSolutionIndex + 1;
    }
  }
}

function rotateRight(piece) {
  const numRows = piece.length;
  const numCols = Math.max(...piece.map((row) => row.length));

  const rotatedPiece = new Array(numCols)
    .fill(null)
    .map(() => new Array(numRows).fill(" "));

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      rotatedPiece[j][numRows - 1 - i] = piece[i][j];
    }
  }

  return rotatedPiece;
}

function rotateLeft(piece) {
  const numRows = piece.length;
  const numCols = Math.max(...piece.map((row) => row.length));

  const rotatedPiece = new Array(numCols)
    .fill(null)
    .map(() => new Array(numRows).fill(" "));

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      rotatedPiece[numCols - 1 - j][i] = piece[i][j];
    }
  }

  return rotatedPiece;
}

function rotateLeftClicked() {
  const images = document.querySelectorAll(".pieces-container img");
  const image = images[selectedPieceIndex];
  let currentRotation = rotationAngles[selectedPieceIndex];
  console.log("currentRotation", currentRotation);
  const newRotation = (currentRotation - 90) % 360;
  console.log("newRotation", newRotation);
  image.style.transform = `rotate(${newRotation}deg)`;
  rotationAngles[selectedPieceIndex] = newRotation;

  const rotatedPiece = rotateLeft(piecesArray[selectedPieceIndex]);
  piecesArray[selectedPieceIndex] = rotatedPiece;
}

function rotateRightClicked() {
  const images = document.querySelectorAll(".pieces-container img");
  const image = images[selectedPieceIndex];
  let currentRotation = rotationAngles[selectedPieceIndex];
  console.log("currentRotation", currentRotation);
  const newRotation = (currentRotation + 90) % 360;
  console.log("newRotation", newRotation);
  image.style.transform = `rotate(${newRotation}deg)`;
  rotationAngles[selectedPieceIndex] = newRotation;

  const rotatedPiece = rotateRight(piecesArray[selectedPieceIndex]);
  piecesArray[selectedPieceIndex] = rotatedPiece;
}

function clearBoardClicked() {
  console.log("clearBoardClicked");
  console.log(isWorkerActive);
  if (isWorkerActive) {
    const buttonSolve = document.getElementById("button-solve");
    buttonSolve.textContent = "Solve Puzzle";
    buttonSolve.style.backgroundColor = "#007BFF";
    isWorkerActive = false;
    worker.terminate();
    const solutionLabel = document.getElementById("label-solution-count");
    const currentSolutionLabel = document.getElementById(
      "label-current-solution"
    );
    solutionLabel.textContent = "";
    currentSolutionLabel.textContent = "";
  }

  boardArray = [];
  solutionsArray = [];
  isPieceAdded = false;
  currentSolutionIndex = -1;

  initBoardArray();
  createBoard(boardArray);
}

function flipPiece(piece) {
  const numRows = piece.length;
  const numCols = Math.max(...piece.map((row) => row.length));

  const oppositePiece = new Array(numRows)
    .fill(null)
    .map(() => new Array(numCols).fill(" "));

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      oppositePiece[i][numCols - 1 - j] = piece[i][j];
    }
  }

  return oppositePiece;
}

function flipPieceClicked() {
  const images = document.querySelectorAll(".pieces-container img");
  const image = images[selectedPieceIndex];

  if (piecesMirrorStates[selectedPieceIndex] == 1) {
    piecesMirrorStates[selectedPieceIndex] = -1;
  } else {
    piecesMirrorStates[selectedPieceIndex] = 1;
  }

  image.style.transform = `scaleX(${piecesMirrorStates[selectedPieceIndex]})`;

  const oppositePiece = flipPiece(piecesArray[selectedPieceIndex]);

  piecesArray[selectedPieceIndex] = oppositePiece;
}

initBoardArray();
createBoard(boardArray);
createPiecesContainer();
addEventListenerToPuzzles();
