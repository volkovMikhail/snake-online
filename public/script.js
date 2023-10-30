const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';

const socket = io(`${protocol}://${window.location.host}/`);

socket.on('connect', function () {
  console.log('Connected');

  socket.emit('message', { test: 'test' });
});

socket.on('message', (data) => {
  console.log(data);
});

//config variables
let snakeSize = 25;
let snakeColor = 'olive';
let fruitColor = 'red';
let delay = 100;

let canv = document.getElementById('canvas');
let ctx = canv.getContext('2d');

canv.width = Math.floor(window.innerWidth / snakeSize) * snakeSize;
canv.height = Math.floor(window.innerHeight / snakeSize) * snakeSize;

const bgColor = window
  .getComputedStyle(document.body, null)
  .getPropertyValue('background-color');

function randomX() {
  return Math.round(
    Math.floor((Math.random() * canv.width) / snakeSize) * snakeSize
  );
}

function randomY() {
  Math.round(Math.floor((Math.random() * canv.height) / snakeSize) * snakeSize);
}

const clientSnake = new Snake(25, 25, snakeColor); //TODO: init with data from server

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

    this.color = fruitColor;
  }

  changePosition(x, y) {
    this.chunk.x = x;

    this.chunk.y = y;
  }

  draw() {
    ctx.fillStyle = color;

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
  }

  head = this.body[this.body - 1];

  draw() {
    ctx.fillStyle = color;

    for (const chunk of body) {
      chunk.Draw();
    }
  }

  toggleDirection(newDirection) {
    for (const key in direction) {
      direction[key] = key === newDirection;
    }
  }

  move() {
    head = Snake[Snake.length - 1];

    if (direction.ArrowUp) {
      Snake.push(new Chunk(head.x, head.y - snakeSize));
      Snake.splice(0, 1);
    }

    if (direction.ArrowDown) {
      Snake.push(new Chunk(head.x, head.y + snakeSize));
      Snake.splice(0, 1);
    }

    if (direction.ArrowRight) {
      Snake.push(new Chunk(head.x + snakeSize, head.y));
      Snake.splice(0, 1);
    }

    if (direction.ArrowLeft) {
      Snake.push(new Chunk(head.x - snakeSize, head.y));
      Snake.splice(0, 1);
    }

    const newHead = Snake[Snake.length - 1];

    if (newHead.x === Fruit.x && newHead.y === Fruit.y) {
      Snake.push(new Chunk(newHead.x, newHead.y));
      drawNewFruit();
    }

    if (newHead.x >= canv.width) newHead.x = 0;
    if (newHead.y >= canv.height) newHead.y = 0;
    if (newHead.x < 0) newHead.x = canv.width;
    if (newHead.y < 0) newHead.y = canv.height;

    for (let i = 0; i < Snake.length - 2; i++) {
      if (Snake[i].x === newHead.x && Snake[i].y === newHead.y) {
        Snake = [new Chunk(0, 0)];
      }
    }

    this.head = newHead;
  }
}

let fruit = new Fruit(100, 100);

function clear() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canv.width, canv.height);
}

class Controls {
  constructor() {
    this.prevKey = null;

    window.addEventListener('keydown', this.keyPressed);
  }

  keyPressed(e) {
    if (
      e.code === 'ArrowUp' &&
      this.prevKey != 'ArrowDown' &&
      e.code != this.prevKey
    ) {
      toggleDirection(e.code);
    }
    if (
      e.code === 'ArrowDown' &&
      this.prevKey != 'ArrowUp' &&
      e.code != this.prevKey
    ) {
      toggleDirection(e.code);
    }
    if (
      e.code === 'ArrowRight' &&
      this.prevKey != 'ArrowLeft' &&
      e.code != this.prevKey
    ) {
      toggleDirection(e.code);
    }
    if (
      e.code === 'ArrowLeft' &&
      this.prevKey != 'ArrowRight' &&
      e.code != this.prevKey
    ) {
      toggleDirection(e.code);
    }

    this.prevKey = e.code;
  }
}

function main() {}

setInterval(main, delay);
