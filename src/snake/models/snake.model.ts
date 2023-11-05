import { Chunk } from './chunk.model';

export class Snake {
  constructor() {
    this.body = [];

    // this.direction = {
    //   up: false,
    //   down: false,
    //   right: false,
    //   left: false
    // };
  }

  public body: Chunk[];

  // direction: {
  //   up: boolean;
  //   down: boolean;
  //   right: boolean;
  //   left: boolean;
  // };
}
