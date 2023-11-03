const rows = 5;
const cols = 11;

const boardArray = [];

var selectedPiece = ""

for (let i = 0; i < rows; i++) {
  // Create a row array
  const row = [];
  for (let j = 0; j < cols; j++) {
    row.push('.');
  }
  // Add the row to the dotArray
  boardArray.push(row);
}

for (let i = 0; i < rows; i++) {
  console.log(boardArray[i].join(' ')); // Join the dots in each row and print
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
            selectedPiece = img.id
            console.log(img.id)
        }
      });
    });
}

function addPieces() {
    const container = document.getElementById("pieces-container");

    // Loop from 1 to 12 to create and append image elements.
    for (let i = 1; i <= 12; i++) {
        const img = document.createElement("img");
        img.id = `piece-${i}`;
        img.src = `piece${i}.png`;
        img.alt = `piece ${i} png`;
        img.width = 100;
        img.height = 90;

        // Add a class to the image for styling with CSS.
        img.className = "piece-image";

        // Append the image element to the container.
        container.appendChild(img);

                // Add a click event listener to each image.

    }
}

function createBoard() {
    const board = document.getElementById("board");

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 11; col++) {
            const square = document.createElement("div");
            square.className = "square background";
            board.appendChild(square);
        }
    }
}


createBoard()
//addPieces()
//addEventListenerToPuzzles()
  
  const pieces = [
    "AAA\nA A",
    "BB\nBBB",
    "C\nCC\n CC",
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
  