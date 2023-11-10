var solutions;
var currentSolution = 0;
var selectedCoordinates = [];
var appliedCoordinates = [];

function addCoordinateClicked() {
  const queenRow = parseInt(document.getElementById("queenRow").value);
  const queenColumn = parseInt(document.getElementById("queenColumn").value);
  const boardSize = parseInt(document.getElementById("boardSize").value);

  if (
    queenRow < boardSize &&
    queenRow >= 0 &&
    queenColumn >= 0 &&
    queenColumn < boardSize
  ) {
    if (selectedCoordinates.some(coord => coord[0] === queenRow && coord[1] === queenColumn)) {
      alert(`Coordinate (${queenRow}, ${queenColumn}) already exists.`);
    } else {
      selectedCoordinates.push([queenRow, queenColumn]);
      document.getElementById("selectedCoordinates").innerHTML =
        document.getElementById("selectedCoordinates").innerHTML +
        `(${queenRow}, ${queenColumn}) `;
      console.log(selectedCoordinates);
    }
  } else {
    alert("Enter a valid coordinate for the board size.");
  }
}

function showPreviousSolution() {
  if (currentSolution != 0) {
    currentSolution = currentSolution - 1;
    console.log(currentSolution);
    createChessboard(currentSolution);
    document.getElementById("currentSolution").innerHTML =
      "Current Solution: " + (currentSolution + 1).toString();
  }
}

function showNextSolution() {
  if (currentSolution != solutions.length - 1) {
    currentSolution = currentSolution + 1;
    console.log(currentSolution);
    createChessboard(currentSolution);
    document.getElementById("currentSolution").innerHTML =
      "Current Solution: " + (currentSolution + 1).toString();
  }
}

function createBoardClicked() {
  currentSolution = 0;
  appliedCoordinates = selectedCoordinates;
  createChessboard();
  document.getElementById("appliedCoordinates").textContent =
    "Applied coordinates: " +
    selectedCoordinates.map(([row, col]) => `(${row},${col})`).join(" ");
  selectedCoordinates = [];
  document.getElementById("selectedCoordinates").textContent =
    "Selected coordinates:";
}

function createChessboard(nthSolution = 0) {
  const boardSize = document.getElementById("boardSize").value;

  const n = parseInt(boardSize);
  const chessboard = document.getElementById("chessboard");

  if (boardSize < 0) {
    alert("Board size can't be less than 1");
  } else if (boardSize > 10) {
    alert("Board size can't be more than 10");
  } else if (boardSize == ""){
    alert("Please enter a valid number for the size.");
  }
  else {
    chessboard.style.setProperty("--n", n);
    let squares = "";

    solutions = solveNQueens(n);
    solutions = solutions.filter(isSolutionValid);

    if (solutions.length === 0) {
      console.log(appliedCoordinates);
      alert("No solutions found.");
      document.getElementById("currentSolution").innerHTML = "";
      document.getElementById("solutionCount").innerHTML = "";
      chessboard.innerHTML = "";
      return;
    }

    document.getElementById("currentSolution").innerHTML =
      "Current Solution: " + (currentSolution + 1).toString();

    document.getElementById("solutionCount").innerHTML =
      "Solution Count: " + solutions.length.toString();

    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        const isBlack = (row + col) % 2 === 1;
        const squareClass = isBlack ? "square black" : "square white";

        if (solutions[nthSolution][row][col] === "Q") {
          squares +=
            '<div class="' +
            squareClass +
            '">' +
            '<img src="../resources/images/queen.png" width="50" height="50">' +
            "</div>";
        } else {
          squares += '<div class="' + squareClass + '">' + "</div>";
        }
      }
    }
    console.log("innerHTML");
    chessboard.innerHTML = squares;
  }

  function solveNQueens(N) {
    let ans = [],
      board = Array.from({ length: N }, () => new Array(N).fill("."));

    const place = (i, vert, ldiag, rdiag) => {
      if (i === N) {
        let res = new Array(N);
        for (let row = 0; row < N; row++) res[row] = board[row].join("");
        ans.push(res);
        return;
      }
      for (let j = 0; j < N; j++) {
        let vmask = 1 << j,
          lmask = 1 << (i + j),
          rmask = 1 << (N - i - 1 + j);
        if (vert & vmask || ldiag & lmask || rdiag & rmask) continue;
        board[i][j] = "Q";
        place(i + 1, vert | vmask, ldiag | lmask, rdiag | rmask);
        board[i][j] = ".";
      }
    };

    place(0, 0, 0, 0);
    return ans;
  }

  function isSolutionValid(solution) {
    for (const [row, col] of appliedCoordinates) {
      if (solution[row][col] !== "Q") {
        return false;
      }
    }
    return true;
  }
}