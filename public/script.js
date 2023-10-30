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
  return Math.round(
    Math.floor((Math.random() * canv.height) / snakeSize) * snakeSize
  );
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
  constructor(startX, startY, color, fruit) {
    this.fruit = fruit;

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

  move() {
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

    //TODO: need to move this logic to main function
    const newHead = this.body[this.body.length - 1];

    if (newHead.x === this.fruit.x && newHead.y === this.fruit.y) {
      this.body.push(new Chunk(newHead.x, newHead.y));

      this.fruit.changePosition(randomX(), randomY());
    }

    if (newHead.x >= canv.width) newHead.x = 0;
    if (newHead.y >= canv.height) newHead.y = 0;
    if (newHead.x < 0) newHead.x = canv.width;
    if (newHead.y < 0) newHead.y = canv.height;

    //game over
    for (let i = 0; i < this.body.length - 2; i++) {
      if (this.body[i].x === newHead.x && this.body[i].y === newHead.y) {
        this.body = [new Chunk(0, 0)];
      }
    }
  }
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

function start() {
  const fruit = new Fruit(100, 100, fruitColor);
  fruit.draw();

  const clientSnake = new Snake(25, 25, snakeColor, fruit);

  const controls = new Controls(clientSnake);

  function main() {
    clear();

    fruit.draw();
    clientSnake.move();
    clientSnake.draw();
  }

  setInterval(main, delay);
}

start();
