let context;

function startGame() {
  gameBoardActions.create();
  heroActions.create();
  gameBoard.enemies.push(new Enemy());
  sightActions.create();
  updateGameArea();
};

function updateGameArea() {
  requestAnimationFrame(() => {
    gameBoardActions.update();
    heroActions.update();
    gameBoard.enemies.map(enemy => enemy.update());
    sightActions.update();
    gameBoard.shotsFired.map((shot, index) => shot.update(index));
    updateGameArea();
  });
};

const gameBoard = {
  width: 1000,
  height: 700,
  keysClicked: [],
  enemies: [],
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
    this.width = 5;
    this.height = 5;
    this.x = hero.x + (hero.width / 2) - (this.height / 2);
    this.y = hero.y + (hero.height / 2) - (this.height / 2);
    this.color = 'white';
    const speedPerTick = 5;
    const deltaX = sight.x + (sight.width / 2) - hero.x - (hero.width / 2);
    const deltaY = sight.y + (sight.height / 2) - hero.y - (hero.height / 2);
    const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    const ratio = speedPerTick / distance;
    this.movementX = ratio * deltaX;
    this.movementY = ratio * deltaY;
  }

  update(index) {
    this.x += this.movementX;
    this.y += this.movementY;
    const enemiesShot = gameBoard.enemies.filter((enemy, enemyIndex) => {
      if (
        this.y > enemy.y + enemy.height ||
        this.y + this.height < enemy.y ||
        this.x > enemy.x + enemy.width ||
        this.x + this.width < enemy.x
      ) {
        return false;
      } 
      gameBoard.enemies.splice(enemyIndex, 1);
      return true;
    });
    if (enemiesShot.length === 0) {
      context.fillStyle = this.color
      context.fillRect(this.x, this.y, this.width, this.height);
    } else {
      gameBoard.shotsFired.splice(index, 1);
    }
  }
};

class Enemy {
  constructor() {
    this.x = 300;
    this.y = 300;
    this.width = 30;
    this.height = 30;
    this.color = 'blue';
    this.create();
  }

  create() {
    context.fillStyle = this.color
    context.fillRect(this.x, this.y, this.width, this.height);
  };

  update() {
    context.fillStyle = this.color
    context.fillRect(this.x, this.y, this.width, this.height);
  };
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