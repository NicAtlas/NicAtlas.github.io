// initializes the canvas
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// this defines the size of the grid
const gridSize = 10;
const cellSize = 50;

// creates a two-dimensional array to store the binary cell states
let grid = [];
resetGrid();

// Draws the grid based on the current state of the cells
function drawGrid() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // set the fill style based on the cell state (1 = alive, 0 = dead)
      ctx.fillStyle = grid[row][col] === 1 ? 'black' : 'white';
      // draw a rectangle to represent the cell
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}

// Updates the state of the cells based on the rules of the Game of Life
function updateGrid() {
  let newGrid = [];
  for (let row = 0; row < gridSize; row++) {
    newGrid[row] = [];
    for (let col = 0; col < gridSize; col++) {
      // Count the number of live neighbors for the current cell
      let liveNeighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          let x = col + i;
          let y = row + j;
          if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
            liveNeighbors += grid[y][x];
          }
        }
      }

      // Update the state of the cell based on the number of live neighbors
      if (grid[row][col] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
        // cell dies from underpopulation or overpopulation
        newGrid[row][col] = 0;
      } else if (grid[row][col] === 0 && liveNeighbors === 3) {
        // cell comes to life due to reproduction
        newGrid[row][col] = 1;
      } else {
        // cell state remains unchanged
        newGrid[row][col] = grid[row][col];
      }
    }
  }
  // update the current state of the cells
  grid = newGrid;
}

// Resets the grid with random cell states
function resetGrid() {
  for (let row = 0; row < gridSize; row++) {
    grid[row] = [];
    for (let col = 0; col < gridSize; col++) {
      // initialize each cell with a random state
      grid[row][col] = Math.round(Math.random());
    }
  }
  drawGrid();
}

// Add event listener to reset button
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetGrid);

// updates the grid every 100 milliseconds
setInterval(() => {
  updateGrid();
  drawGrid();
}, 100);