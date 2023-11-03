const rows = 5;
const cols = 11;

let boardArray = [];

let piecesArray = [
    [['A', 'A', 'A'], ['A', '.', 'A']],
    [['.', '.', 'B', 'B'], ['B', 'B', 'B']],
    [['.', 'C'], ['C', 'C'], ['.', 'C', 'C']],
    [['.', 'D'], ['D', 'D', 'D']],
    [['.', 'E'], ['E', 'E', 'E', 'E']],
    [['.', 'F', 'F'], ['F', 'F', 'F']],
    [['.', 'G', 'G'], ['G', 'G', '.']],
    [['H', 'H'], ['H'], ['H']],
    [['I', 'I', 'I'], ['.', '.', 'I'], ['.', '.', 'I']],
    [['J'], ['J', 'J', 'J', 'J']],
    [['K'], ['K', 'K']],
    [['L', 'L'], ['.', 'L', 'L'], ['.', '.', 'L']]
  ];

var selectedPieceIndex

function initBoardArray() {
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          row.push('.');
        }
        boardArray.push(row);
      }
      for (let i = 0; i < rows; i++) {
        console.log(boardArray[i].join(' '));
      }
}


function addEventListenerToPuzzles() {
    const images = document.querySelectorAll('.pieces-container img');
1
    images.forEach((img) => {
      img.addEventListener('click', () => {

        if (img.classList.contains('highlighted')) {
            img.classList.remove('highlighted')
            selectedPiece = ""
        } else {
            images.forEach((i) => i.classList.remove('highlighted'));
            img.classList.add('highlighted');
            selectedPieceIndex = parseInt(img.id) - 1
            console.log(selectedPieceIndex)
        }
      });
    });
}

function createPiecesContainer() {
    const container = document.getElementById("pieces-container");

    for (let i = 1; i <= 12; i++) {
        const img = document.createElement("img");
        img.id = `${i}`;
        img.src = `piece${i}.png`;
        img.alt = `piece ${i} png`;
        img.width = 100;
        img.height = 90;
        img.className = "piece-image";

        container.appendChild(img);
    }
}

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = ""
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 11; col++) {
            const square = document.createElement("div");
            if (boardArray[row][col] == '.') {
                square.className = "square background";
            } else if (boardArray[row][col] == 'A') {
                square.className = "square A";
            } else {
                square.className = "square A";
            }
            board.appendChild(square);
        }
    }
}
function addPieceClicked() {
    boardArray = []
    initBoardArray()
    const selectedPiece = piecesArray[selectedPieceIndex]
    let pieceRowIndex = 0
    for (let row = rows - selectedPiece.length; row < 5; row++) {
        let pieceRow = selectedPiece[pieceRowIndex]
        console.log(pieceRow)
        for(let col = 0; col < pieceRow.length; col++) {
            boardArray[row][col] = pieceRow[col]
        }
        pieceRowIndex++
    }
    console.log(boardArray)
    createBoard()
}

initBoardArray()
createBoard()
createPiecesContainer()
addEventListenerToPuzzles()
  



/*
  const pieces2 = [
    [['A','A','A'],['A','.','A']],
    [['.','.','B','B'],['B','B','B']],
    [['.','C'],['C','C'],['.','C','C']],
    "D\nDDD",
    "E\nEEEE",
    "FF\nFFF",
    "GG\nGG",
    "HH\nH\nH",
    "III\n  I\n  I",
    "J\nJJJJ",
    "K\nKK",
    "LL\n LL\n  L",
  ];

  pieces["piece-1"] = [['A','A','A'],['A','.','A']]
pieces["piece-2"] = [['.','.','B','B'],['B','B','B']]
pieces["piece-3"] = [['.','C'],['C','C'],['.','C','C']]
pieces["piece-4"] = [['.','D'],['D','D','D']]
pieces["piece-5"] = [['.','E'],['E','E','E','E']]
pieces["piece-6"] = [['.','F','F'],['F','F','F']]
pieces["piece-7"] = [['.','G','G'],['G','G','.']]
pieces["piece-8"] = [['H','H'],['H'],['H']]
pieces["piece-9"] = [['I','I','I'],['.','.','I'],['.','.','I']]
pieces["piece-10"] = [['J'],['J','J','J','J']]
pieces["piece-11"] = [['K'],['K','K']]
pieces["piece-12"] = [['L','L'],['.','L','L'],['.','.','L']]
  */