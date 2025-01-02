/* 
Czas ostatniego wykonania animacji (wąż nie ruszył się przed startem gry, dlatego
jest on równy zero). Jest on po to, żeby znać czas wykonania ostatniej animacji. Daje mi to możliwość
pózniejszego obliczenia płynnego i równomieronego poruszania się węża.
*/
let lastAnimationTime = 0;

/*
Daję sobie dostęp do planszy węża. Jest ona po to, żeby wąż miał gdzie się poruszać. Daje mi to możliwość
późniejszego wyznaczenia wężowi granic planszy.
*/
const gameBoard = document.querySelector('.game');

/*
Odświeża się co każdą wykonaną animację, określając jak szybko wąż ma się poruszać,
wykonując wywołane w niej funkcje i sprawdzając czy wąż nie uderzył w ściane ani w swoje ciało.
Jest ona po to żeby animować ruchy węża. Daje mi płynne i równomierne poruszanie się węża.
*/
function gameLoop(currentAnimationTime) {
  /*
  Określa czas od ostatniego wykonania animacji. Jest on wynikiem odejmowania czasu wykonania teraźniejszej 
  animacji od czasu wykonania ostatniej animacji. Jest on po to, żeby obliczyć szybkość poruszania się węża.
  Daje mi to płynne poruszanie się węża.
  */
  let timeSinceLastAnimation =
    (currentAnimationTime - lastAnimationTime) / 1000;

  /*
Warunek sprawdzający czy od ostatniego czasu animacji minęło wystarczająco czasu. Jest on po to, żeby
w razie upłynięcia określonego czasu uruchomić kolejną animację. Daje mi on płynny i równomierne wykonywanie
się animacji.
*/
  if (timeSinceLastAnimation < 1 / SNAKE_SPEED) {
    window.requestAnimationFrame(gameLoop);
    return;
  }

  /*
Mówi, żeby czas wykonania ostatniej animacji, bedzie się równac czasowi wykonania teraźniejszej animacji.
Jest on po to żeby zachować płynny czas pomiędzy animacjami. Daje mi to brak problemów z różnicą w czasie
wykonywanych animacji.
*/
  lastAnimationTime = currentAnimationTime;

  /* Warunek sprawdzający czy wąż dotknął granicy planszy lub swojego ciała. Jest on po to żeby w razie
  dotknięcia przez węża ściany lub swojego ciała zrestartować grę. Daje mi to możliwość zagrania w grę
  jeszcze raz po przegraniu.
  */
  if (checkWallCollision() || checkSelfCollision()) {
    if (confirm('You lost. Press ok to restart')) {
      window.location = '/';
    }
    return;
  }
  // CO TO ROBI! PO CO TO JEST! CO MI TO DAJE!
  /*
Wywołanie funkcji obsługujących poruszanie i wygląd węża oraz wygląd i miejsce pojawienia się jedzenia.
Jest po to żeby wąż rósł podczas jedzenia i żeby jedzenie się pojawiało. 
*/
  updateSnakePosition();
  updateFoodPosition();
  drawSnake(gameBoard);
  drawFood(gameBoard);

  /*
  Tworzy płynne animacje w przeglądarce. Jest po to żeby płynnie odświeżać funkcję gameLoop. Daje mi to
  wykonanie płynnych animacji do poruszania węża.
   */
  window.requestAnimationFrame(gameLoop);
}

/*
  Tworzy płynne animacje w przeglądarce. Jest po to żeby płynnie odświeżać funkcję gameLoop. Daje mi to
  wykonanie płynnych animacji do poruszania węża.
   */
window.requestAnimationFrame(gameLoop);

/*
Określa szybkość poruszania się węża. Daje to możliwość stałego czasu pomiędzy ruchami węża. Jest po to żeby
wąż płynnie się poruszał.
*/
const SNAKE_SPEED = 2;

/*
Określa początkową pozycję węza. Jest po to zeby ustalić, gdzie wąz ma być na początku gry. 
Daje mi to możliwosć poruszania wężem przez zwiększania lub zmniejszanie współrzędnych.
*/
let snake = [{ x: 11, y: 11 }];
let newSegment = 0;

/*
Funkcja rysująca każdy element węża po kolei, na współrzędnych, na któreych się znajdują. Jest po to żeby
rysowac element dla każdego elementu ciała węża.  Daje mi to możliwość rysowania węża w razie powiększenia.
*/
function drawSnake(gameBoard) {
  gameBoard.innerHTML = '';
  snake.forEach((segment) => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.className = 'snake';
    gameBoard.appendChild(snakeElement);
  });
}

/*
To ściągnąłem z czata i nie zabardzo czaje. 
*/
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

/*
Funckja powiększająca węża o jeden segment po zjedzeniu jedzenia. Jest po to żeby snake mógł rosnąć
w kontrolowany sposób. Daje mi to możliwość powiększania węża.
*/
function expandSnake(amount) {
  newSegment += amount;
}

/*
Określa początkową pozycję jedzenia. Jest po to żeby jedzenie pojawiło się na oznaczonym polu. 
Daje mi to możliwość późniejszego manipulowania pozycją jedzenia po zjedzeniu.
*/
let food = [{ x: 1, y: 1 }];

/*
Określa ilość segmentów o które zwiększy się wąż po zjedzeniu jedzenia.
Jest po to żeby wąż powiększał się w stały sposób. 
Daje mi to możliwość zwiększania rozmiaru węża po zjedzeniu.
*/
const EXPAND_NUMBER = 1;

/*
Funkcja tworząca jedzenie na określonym miejscu.
Jest po to żeby wąż mógł jeść i rosnąć.
Daje mi to możliwość pokazania animacji jedzenia przez węża.
*/
function drawFood(gameBoard) {
  food.forEach((position) => {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = position.y;
    foodElement.style.gridColumnStart = position.x;
    foodElement.className = 'food';
    gameBoard.appendChild(foodElement);
  });
}

/*
Funckja, która najpierw spradza czy wąż zjadł jedzenie. Jeśli zjadł jedzenie to 
powiększa go o jeden segment. A następnie generuje losową pozycję na planszy dla 
nowego jedzenia, które pojawi się po zjedzeniu starego.
*/
function updateFoodPosition() {
  if (checkIsInSnake(food[0])) {
    expandSnake(EXPAND_NUMBER);
    food[0] = {
      x: Math.floor(Math.random() * 21) + 1,
      y: Math.floor(Math.random() * 21) + 1,
    };
  }
}

/*
Funckja sprawdzająca czy jedzenie znajduje się w wężu.
Jest ona po to żeby wykonać funkcję generującą nową pozycje jedzenia.
Daje mi to możliwość kontynuacji gry ze zwiększonym o jeden segment wężem.
*/
function checkIsInSnake(position) {
  return snake.some((segment) => checkEqualPosition(segment, position));
}

/*
Funkcja sprawdzająca czy pozycja węża jest równa z pozycją jedzenia.
Jest ona po to, żeby sprawdzić czy wąż zjadł jedzenie.
Daje mi to możliwość sprawdzenia czy jedzenie będzie znajdować się w wężu.
*/
function checkEqualPosition(position1, position2) {
  return position1.x === position2.x && position1.y === position2.y;
}

/*
Funkcja ustawiająca strzałki na klawiaturze jako narzędzie do poruszania wężem. Jest ona po to żeby
mówić wężowi jak ma się poruszać. Daje mi to możliwość poruszania wężem.
*/
let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      if (lastInputDirection.y !== 1) inputDirection = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (lastInputDirection.y !== -1) inputDirection = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (lastInputDirection.x !== 1) inputDirection = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (lastInputDirection.x !== -1) inputDirection = { x: 1, y: 0 };
      break;
  }
});

/*
Funkcja zapisująca ostatnią pozycję węża. Jest po to żeby ten kirunek
udostępnić innym funkcjom. Daje mi to możliwość śledzenia pozycji węża.
*/

function setSnakeDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}

/* 
Funkcja, która sprawdza czy wąz dotknął głową krawędzi plaszy. Jest po to, zeby w razie dotknięcia
krawędzi przez węza zakońćzyć gre. Daje mi to mozliwość ponownego zagrania w razie przegrania gry.
*/
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

/* 
Funkcja, która sprawdza czy wąz dotknie głową swojego ciała. 
Jest po to, zeby w razie kolizji zakończyć gre.
Daje mi to możliwość ponownego zagrania w grę w razię porażki.
*/
function checkSelfCollision() {
  const head = snake[0];
  return snake.some((segment, index) => {
    return index !== 0 && head.x === segment.x && head.y === segment.y;
  });
}
