//config variables
let snakeSize = 25;
let snakeColor = 'olive';
let fruitColor = 'red';
let delay = 100;

let canv = document.getElementById('canvas');
let ctx = canv.getContext('2d');

canv.width = 800;
canv.height = 800;

const bgColor = window
  .getComputedStyle(document.body, null)
  .getPropertyValue('background-color');

function randomX() {
  return Math.round(
    Math.floor((Math.random() * canv.width) / snakeSize) * snakeSize
  );
}

function randomY() {
  return Math.round(
    Math.floor((Math.random() * canv.height) / snakeSize) * snakeSize
  );
}

function clear() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canv.width, canv.height);
}

class Controls {
  constructor(clientSnake) {
    this.clientSnake = clientSnake;

    this.prevKey = null;

    window.addEventListener('keydown', this.keyPressed.bind(this));
  }

  keyPressed(e) {
    if (
      e.code === 'ArrowUp' &&
      this.prevKey != 'ArrowDown' &&
      e.code != this.prevKey
    ) {
      this.clientSnake.toggleDirection(e.code);
    }
    if (
      e.code === 'ArrowDown' &&
      this.prevKey != 'ArrowUp' &&
      e.code != this.prevKey
    ) {
      this.clientSnake.toggleDirection(e.code);
    }
    if (
      e.code === 'ArrowRight' &&
      this.prevKey != 'ArrowLeft' &&
      e.code != this.prevKey
    ) {
      this.clientSnake.toggleDirection(e.code);
    }
    if (
      e.code === 'ArrowLeft' &&
      this.prevKey != 'ArrowRight' &&
      e.code != this.prevKey
    ) {
      this.clientSnake.toggleDirection(e.code);
    }

    this.prevKey = e.code;
  }
}

class Chunk {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  Draw() {
    ctx.fillRect(this.x, this.y, snakeSize, snakeSize);
  }
}

class Fruit {
  constructor(startX, startY, fruitColor) {
    this.chunk = new Chunk(startX, startY);

    this.x = startX;
    this.y = startY;

    this.color = fruitColor;
  }

  changePosition(x, y) {
    this.x = x;
    this.y = y;

    this.chunk = new Chunk(x, y);
  }

  draw() {
    ctx.fillStyle = this.color;

    this.chunk.Draw();
  }
}

class Snake {
  constructor(startX, startY, color) {
    this.body = [new Chunk(startX, startY)];

    this.color = color;

    this.direction = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowRight: false,
      ArrowLeft: false
    };

    this.head = this.body[this.body.length - 1];
  }

  draw() {
    ctx.fillStyle = this.color;

    for (const chunk of this.body) {
      chunk.Draw();
    }
  }

  toggleDirection(newDirection) {
    for (const key in this.direction) {
      this.direction[key] = key === newDirection;
    }
  }

  move(gameOverCallback) {
    this.head = this.body[this.body.length - 1];

    if (this.direction.ArrowUp) {
      this.body.push(new Chunk(this.head.x, this.head.y - snakeSize));
      this.body.splice(0, 1);
    }

    if (this.direction.ArrowDown) {
      this.body.push(new Chunk(this.head.x, this.head.y + snakeSize));
      this.body.splice(0, 1);
    }

    if (this.direction.ArrowRight) {
      this.body.push(new Chunk(this.head.x + snakeSize, this.head.y));
      this.body.splice(0, 1);
    }

    if (this.direction.ArrowLeft) {
      this.body.push(new Chunk(this.head.x - snakeSize, this.head.y));
      this.body.splice(0, 1);
    }

    this.head = this.body[this.body.length - 1];

    if (this.head.x >= canv.width) this.head.x = 0;
    if (this.head.y >= canv.height) this.head.y = 0;
    if (this.head.x < 0) this.head.x = canv.width;
    if (this.head.y < 0) this.head.y = canv.height;

    //game over
    for (let i = 0; i < this.body.length - 2; i++) {
      if (this.body[i].x === this.head.x && this.body[i].y === this.head.y) {
        gameOverCallback();
      }
    }

    socket.emit(PLAYER_MOVE, this.head);
  }

  moveUserFromSrv(update, gameOverCallback) {
    this.body.splice(0, 1);

    if (update?.length) {
      const chunks = update.map(
        (plainChunk) => new Chunk(plainChunk.x, plainChunk.y)
      );

      this.body.push(...chunks);
    }

    this.head = this.body[this.body.length - 1];

    if (this.head) {
      if (this.head.x >= canv.width) this.head.x = 0;
      if (this.head.y >= canv.height) this.head.y = 0;
      if (this.head.x < 0) this.head.x = canv.width;
      if (this.head.y < 0) this.head.y = canv.height;

      //game over user from srv
      for (let i = 0; i < this.body.length - 2; i++) {
        if (this.body[i].x === this.head.x && this.body[i].y === this.head.y) {
          gameOverCallback();
        }
      }
    }
  }
}

//constant event types
const PLAYER_MOVE = 'PLAYER_MOVE';
const NEXT_MOVE = 'NEXT_MOVE';
const SNAKE_GROW = 'SNAKE_GROW';
const GAME_INFO = 'GAME_INFO';
const UPDATE = 'UPDATE';

//socket logic
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';

const socket = io(`${protocol}://${window.location.host}/`);

socket.on('connect', function () {
  console.log('Connected');
});

let startInfo;
let clientStartInfo;

socket.on(GAME_INFO, (data) => {
  startInfo = data;
  clientStartInfo = startInfo.playerSnakes[startInfo.id];

  start();
});

function start() {
  const fruit = new Fruit(100, 100, fruitColor);
  fruit.draw();

  const clientSnake = new Snake(
    clientStartInfo.body[0].x,
    clientStartInfo.body[0].y,
    snakeColor
  );

  const srvUsers = new Map();

  Object.keys(startInfo.playerSnakes).forEach((key) => {
    if (key === startInfo.id) {
      return;
    }

    const srvUserSnake = startInfo.playerSnakes[key].body;

    const newSnake = new Snake(0, 0, snakeColor);

    newSnake.body = srvUserSnake.map((chunk) => new Chunk(chunk.x, chunk.y));

    srvUsers.set(key, newSnake);
  });

  const controls = new Controls(clientSnake);

  function main(update) {
    clear();

    Object.keys(update).forEach((id) => {
      if (!srvUsers.get(id)) {
        const newSnake = new Snake(0, 0, snakeColor);

        newSnake.body = update[id].map(
          (chunk) => new Chunk(chunk.x, chunk.y)
        );

        srvUsers.set(id, newSnake);
      }
    });

    fruit.draw();
    clientSnake.move(() => (clientSnake.body = [new Chunk(25, 25)]));

    if (clientSnake.head.x === fruit.x && clientSnake.head.y === fruit.y) {
      clientSnake.body.push(new Chunk(clientSnake.head.x, clientSnake.head.y));

      fruit.changePosition(randomX(), randomY());

      socket.emit(SNAKE_GROW);
    }

    for (const entry of srvUsers.entries()) {
      const [id, snake] = entry;

      const currentUserSnakeUpdate = update[id];

      snake.moveUserFromSrv(currentUserSnakeUpdate, () =>
        console.log('GAME OVER')
      );

      snake.draw();
    }

    clientSnake.draw();
  }

  socket.on(NEXT_MOVE, (data) => main(data));
}
