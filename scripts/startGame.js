let context;

function startGame() {
  gameBoardActions.create();
  gamePieceActions.create();
  updateGameArea();
};

const gameBoard = {
  width: 480,
  height: 270,
  keysClicked: []
}

const gameBoardActions = {
  create: () => {
    const canvas = document.createElement('canvas');
    canvas.width = gameBoard.width;
    canvas.height = gameBoard.height;
    context = canvas.getContext('2d');
    document.body.insertBefore(canvas, document.body.childNodes[0]);
  },
  update: () => {
    context.clearRect(0, 0, gameBoard.width, gameBoard.height);
  }
}

const gamePiece = {
  x: 10,
  y: 120,
  width: 30,
  height: 30,
  color: 'red',
  translationX: 0,
  translationY: 0
};

const gamePieceActions = {
  create: () => {
    const {x, y, width, height, color} = gamePiece;
    context.fillStyle = color
    context.fillRect(x, y, width, height);
  },
  update: () => {
    const {width, height, color} = gamePiece;
    if (gameBoard.keysClicked && gameBoard.keysClicked['KeyA']) gamePiece.translationX += -2;
    if (gameBoard.keysClicked && gameBoard.keysClicked['KeyDw']) gamePiece.translationX += 2;
    if (gameBoard.keysClicked && gameBoard.keysClicked['KeyW']) gamePiece.translationY += -2;
    if (gameBoard.keysClicked && gameBoard.keysClicked['KeyS']) gamePiece.translationY += 2;
    gamePiece.x += gamePiece.translationX;
    gamePiece.y += gamePiece.translationY;
    context.fillStyle = color
    context.fillRect(gamePiece.x, gamePiece.y, width, height);
    gamePiece.translationX = 0;
    gamePiece.translationY = 0;
  }
}

function updateGameArea() {
  requestAnimationFrame(() => {
    gameBoardActions.update();
    gamePieceActions.update();
    updateGameArea();
  });
}

window.addEventListener('keydown', function (event) {
  gameBoard.keysClicked = (gameBoard.keysClicked || []);
  gameBoard.keysClicked[event.code] = (event.type == "keydown");
});

window.addEventListener('keyup', function (event) {
  gameBoard.keysClicked[event.code] = (event.type == "keydown");
});