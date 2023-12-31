import { Chunk } from './chunk.model';
import { Snake } from './snake.model';

export class Player {
  constructor(startChunk: Chunk) {
    this.startChunk = startChunk;

    this.hasNextMove = true;

    this.snake = new Snake();

    this.snake.body = [startChunk];
  }

  startChunk: Chunk;

  snake: Snake;

  hasNextMove: boolean;
}
