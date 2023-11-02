import { Chunk } from './chunk.model';

export class Player {
  constructor() {
    this.hasNextMove = true;

    this.snakeBody = [];
  }

  snakeBody: Chunk[];

  hasNextMove: boolean;
}
