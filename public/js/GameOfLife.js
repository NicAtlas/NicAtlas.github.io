const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 10;
const cellSize = 50;
let grid = [];
let isInteractive = true;
let isRunning = false;

initializeGrid();

// Add event listener to start button
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);

// Add event listener to reset button
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetGame);

canvas.addEventListener('mousedown', (event) => {
  if (!isInteractive || isRunning) {
    return;
  }
  const row = Math.floor(event.offsetY / cellSize);
  const col = Math.floor(event.offsetX / cellSize);
  if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
    grid[row][col] = 1 - grid[row][col];
    drawGrid();
  }
});

function initializeGrid() {
  grid = [];
  for (let row = 0; row < gridSize; row++) {
    grid[row] = [];
    for (let col = 0; col < gridSize; col++) {
      grid[row][col] = 0;
    }
  }
  drawGrid();
}

function startGame() {
  isInteractive = false;
  isRunning = true;
  startButton.disabled = true;
  resetButton.disabled = false;
  runSimulation();
}

function resetGame() {
  isInteractive = true;
  isRunning = false;
  startButton.disabled = false;
  resetButton.disabled = true;
  initializeGrid();
}

function drawGrid() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      ctx.fillStyle = grid[row][col] === 1 ? 'black' : 'white';
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}

function runSimulation() {
  if (isRunning) {
    updateGrid();
    drawGrid();
    setTimeout(runSimulation, 100);
  }
}

function updateGrid() {
  let newGrid = [];
  for (let row = 0; row < gridSize; row++) {
    newGrid[row] = [];
    for (let col = 0; col < gridSize; col++) {
      let liveNeighbors = countLiveNeighbors(row, col);
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

function countLiveNeighbors(row, col) {
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
  return liveNeighbors;
}