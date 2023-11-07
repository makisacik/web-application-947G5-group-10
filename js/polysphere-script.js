const rows = 5;
const cols = 11;

let boardArray = [];

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

initBoardArray();
createBoard(boardArray);
createPiecesContainer();
addEventListenerToPuzzles();
