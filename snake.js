let lastAnimationTime = 0;
const gameBoard = document.querySelector(".game");

function gameLoop(currentAnimationTime) {
  let timeSinceLastAnimation =
    (currentAnimationTime - lastAnimationTime) / 1000;

  if (timeSinceLastAnimation < 1 / SNAKE_SPEED) {
    window.requestAnimationFrame(gameLoop);
    return;
  }

  lastAnimationTime = currentAnimationTime;

  if (checkWallCollision() || checkSelfCollision()) {
    if (confirm("You lost. Press ok to restart")) {
      window.location = "/";
    }
    return;
  }

  updateSnakePosition();
  updateFoodPosition();
  drawSnake(gameBoard);
  drawFood(gameBoard);

  window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

// SNAKE
const SNAKE_SPEED = 2;
let snake = [{ x: 11, y: 11 }];
let newSegment = 0;

function drawSnake(gameBoard) {
  gameBoard.innerHTML = "";
  snake.forEach((segment) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.className = "snake";
    gameBoard.appendChild(snakeElement);
  });
}

function updateSnakePosition() {
  const inputDirection = setSnakeDirection();
  for (let i = snake.length - 2; i >= 0; i--) {
    snake[i + 1] = { ...snake[i] };
  }

  if (newSegment > 0) {
    snake.push({ ...snake[snake.length - 1] });
    newSegment--;
  }

  snake[0].x += inputDirection.x;
  snake[0].y += inputDirection.y;
}

function expandSnake(amount) {
  newSegment += amount;
}

// FOOD
let food = [{ x: 1, y: 1 }];
const EXPAND_NUMBER = 1;

function drawFood(gameBoard) {
  food.forEach((position) => {
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = position.y;
    foodElement.style.gridColumnStart = position.x;
    foodElement.className = "food";
    gameBoard.appendChild(foodElement);
  });
}

function updateFoodPosition() {
  if (checkIsInSnake(food[0])) {
    expandSnake(EXPAND_NUMBER);
    food[0] = {
      x: Math.floor(Math.random() * 21) + 1,
      y: Math.floor(Math.random() * 21) + 1,
    };
  }
}

function checkIsInSnake(position) {
  return snake.some((segment) => checkEqualPosition(segment, position));
}

function checkEqualPosition(position1, position2) {
  return position1.x === position2.x && position1.y === position2.y;
}

// CONNECTING TO ARROWS
let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (lastInputDirection.y !== 1) inputDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (lastInputDirection.y !== -1) inputDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (lastInputDirection.x !== 1) inputDirection = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (lastInputDirection.x !== -1) inputDirection = { x: 1, y: 0 };
      break;
  }
});

function setSnakeDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}

// CHECKING IF GAME OVER

const MINIMAL_SIZE = 1;
const BOARD_SIZE = 21;
const head = snake[0];

function checkWallCollision() {
  return (
    head.x < MINIMAL_SIZE ||
    head.x > BOARD_SIZE ||
    head.y < MINIMAL_SIZE ||
    head.y > BOARD_SIZE
  );
}

function checkSelfCollision() {
  const head = snake[0];
  return snake.some((segment, index) => {
    return index !== 0 && head.x === segment.x && head.y === segment.y;
  });
}
