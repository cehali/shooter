let context;

function startGame() {
  gameBoardActions.create();
  heroActions.create();
  sightActions.create();
  updateGameArea();
};

function updateGameArea() {
  requestAnimationFrame(() => {
    gameBoardActions.update();
    heroActions.update();
    sightActions.update();
    gameBoard.shotsFired.map(shot => shot.update());
    updateGameArea();
  });
};

const gameBoard = {
  width: 1000,
  height: 700,
  keysClicked: [],
  shotsFired: []
};

const gameBoardActions = {
  create: () => {
    const canvas = document.createElement('canvas');
    canvas.width = gameBoard.width;
    canvas.height = gameBoard.height;
    canvas.style.cursor = 'none';
    context = canvas.getContext('2d');
    document.body.insertBefore(canvas, document.body.childNodes[0]);
  },
  update: () => {
    context.clearRect(0, 0, gameBoard.width, gameBoard.height);
  }
};

const hero = {
  x: 10,
  y: 120,
  width: 30,
  height: 30,
  color: 'red',
  translationX: 0,
  translationY: 0
};

const heroActions = {
  create: () => {
    const {x, y, width, height, color} = hero;
    context.fillStyle = color
    context.fillRect(x, y, width, height);
  },
  update: () => {
    const {width, height, color} = hero;
    if (gameBoard.keysClicked && gameBoard.keysClicked['KeyA']) hero.translationX += -2;
    if (gameBoard.keysClicked && gameBoard.keysClicked['KeyD']) hero.translationX += 2;
    if (gameBoard.keysClicked && gameBoard.keysClicked['KeyW']) hero.translationY += -2;
    if (gameBoard.keysClicked && gameBoard.keysClicked['KeyS']) hero.translationY += 2;
    hero.x += hero.translationX;
    hero.y += hero.translationY;
    context.fillStyle = color
    context.fillRect(hero.x, hero.y, width, height);
    hero.translationX = 0;
    hero.translationY = 0;
  }
};

const sight = {
  x: 80,
  y: 130,
  width: 10,
  height: 10,
  color: 'green'
};

const sightActions = {
  create: () => {
    const {x, y, width, height, color} = sight;
    context.fillStyle = color
    context.fillRect(x, y, width, height);
  },
  update: () => {
    const {x, y, width, height, color} = sight;
    context.fillStyle = color
    context.fillRect(x, y, width, height);
  }
};

class Shot {
  constructor() {
    this.x = hero.x + hero.width / 2;
    this.y = hero.y + hero.height / 2;
    this.width = 5;
    this.height = 5;
    this.color = 'white';
    const speedPerTick = 5;
    const deltaX = sight.x - hero.x;
    const deltaY = sight.y - hero.y;
    const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    const ratio = speedPerTick / distance;
    this.movementX = ratio * deltaX;
    this.movementY = ratio * deltaY;
  }

  update() {
    this.x += this.movementX;
    this.y += this.movementY;
    context.fillStyle = this.color
    context.fillRect(this.x, this.y, this.width, this.height);
  }
};

window.addEventListener('keydown', (event) => {
  gameBoard.keysClicked = (gameBoard.keysClicked || []);
  gameBoard.keysClicked[event.code] = (event.type == "keydown");
});

window.addEventListener('keyup', (event) => {
  gameBoard.keysClicked[event.code] = (event.type == "keydown");
});

window.addEventListener('mousemove', (event) => {
  sight.x = event.pageX;
  sight.y = event.pageY;
});

window.addEventListener('mousedown', (event) => {
  const shot = new Shot();
  gameBoard.shotsFired.push(shot);
});