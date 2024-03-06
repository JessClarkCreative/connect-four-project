// Player class represents a player with a specific color
class Player {
  constructor(color) {
    this.color = color;
  }
}

// Game class represents the Connect 4 game
class Game {
  constructor() {
    // Constants for the width and height of the game board
    this.WIDTH = 7;
    this.HEIGHT = 6;

    // Initialize variables for the current player, player1, player2, game board, and game state
    this.currPlayer = null;
    this.player1 = null;
    this.player2 = null;
    this.board = [];
    this.gameOver = false;

    // Initialize the game board and UI elements, and set up event handlers
    this.makeBoard();
    this.makeHtmlBoard();
    this.setupStartButton();

    // Bind the handleClick method to the instance to maintain 'this' context
    this.handleGameClick = this.handleClick.bind(this);
  }

  // Method to create an empty game board
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  // Method to create the HTML representation of the game board
  makeHtmlBoard() {
    const board = document.getElementById('board');

    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    // Add event listener for column clicks
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  // Method to find the lowest available spot in a column
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  // Method to place a game piece in the table
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  // Method to end the game with a message
  endGame() {
    this.gameOver = true;
    const winnerMessage = this.currPlayer === this.player1
      ? "Player 1 won!"
      : "Player 2 won!";
    alert(winnerMessage);
  }

  // Method to handle a player's move
  handleClick(evt) {
    console.log("Before click - Current Player:", this.currPlayer);
    if (this.gameOver) {
      return; // Do nothing if the game is over
    }
  
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
  
    if (y === null || y === undefined) {
      console.log("Invalid spot selected");
      return;
    }
  
    console.log("Selected spot:", { x, y });
  
    // Check if this.currPlayer is null or undefined
    if (!this.currPlayer) {
      console.error("Error: Current player is null or undefined");
      return;
    }
  
    // Set the board cell to the current player instance
    this.board[y][x] = this.currPlayer.color;
  
    this.placeInTable(y, x);
  
    if (this.checkForWin()) {
      const winnerMessage = this.currPlayer === this.player1
      ? "Player 1 won!"
      : "Player 2 won!";
      return this.endGame(winnerMessage);
    }
  
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
  
    // Switch to the other player for the next turn
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
    console.log("After click - Current Player:", this.currPlayer);
  }

  // Helper method to check for a winning combination
  _checkForWin(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer.color
    );
  }

  // Method to check for a win in the game
  checkForWin() {
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (
          this._checkForWin(horiz) ||
          this._checkForWin(vert) ||
          this._checkForWin(diagDR) ||
          this._checkForWin(diagDL)
        ) {
          console.log("Winner found!");
          return true;
        }
      }
    }
    return false;
  }

  // Method to set up the event listener for the "Start Game" button
  setupStartButton() {
  const startButton = document.getElementById('start-game');
  startButton.addEventListener('click', (e) => {
    e.preventDefault();
    this.setupPlayers();
    this.resetGame();
  });
}
  

  // Method to set up the player instances with colors
  setupPlayers() {
    // Read color values directly at this point
    const player1Color = document.getElementById('player1-color').value;
    const player2Color = document.getElementById('player2-color').value;
  
    this.player1 = new Player(player1Color);
    this.player2 = new Player(player2Color);
  
    console.log("Player 1:", this.player1);
    console.log("Player 2:", this.player2);
  
    // Ensure that this.currPlayer is never null before the game starts
    this.currPlayer = this.player1 || this.player2 || new Player("DefaultColor");
  
    console.log("Current Player:", this.currPlayer);
  
    // Check if this.currPlayer is still null or undefined
    if (!this.currPlayer) {
      console.error("Error: Current player is null or undefined after setupPlayers()");
    } else {
      console.log("Current player is defined and not null.");
    }
  }
  
  
  
  // Method to reset the game state
  resetGame() {
    this.currPlayer = this.player1;
    this.board = [];
    this.gameOver = false;

    console.log("Resetting Game - Current Player:", this.currPlayer);

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Clear the board

    this.makeBoard();
    this.makeHtmlBoard();
  }
}

// Create an instance of the Game class to start the game
const game = new Game();
