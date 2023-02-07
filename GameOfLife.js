// Initialize the canvas
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Define the size of the grid
const gridSize = 10;
const cellSize = 50;

// Create a two-dimensional array to store the state of cells
let grid = [];
for (let row = 0; row < gridSize; row++) {
  grid[row] = [];
  for (let col = 0; col < gridSize; col++) {
    grid[row][col] = Math.round(Math.random());
  }
}

// Draw the grid
function drawGrid() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      ctx.fillStyle = grid[row][col] === 1 ? 'black' : 'white';
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}

// Update the state of cells
function updateGrid() {
  let newGrid = [];
  for (let row = 0; row < gridSize; row++) {
    newGrid[row] = [];
    for (let col = 0; col < gridSize; col++) {
      // Count the number of live neighbors
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
        newGrid[row][col] = 0;
      } else if (grid[row][col] === 0 && liveNeighbors === 3) {
        newGrid[row][col] = 1;
      } else {
        newGrid[row][col] = grid[row][col];
      }
    }
  }
  grid = newGrid;
}

// Draw the initial grid
drawGrid();

// Update the grid every 100 milliseconds
setInterval(() => {
  updateGrid();
  drawGrid();
}, 100);
