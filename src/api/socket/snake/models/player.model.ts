import { PlayerMove } from "../types";

export class Player {
  constructor() {
    this.hasNextMove = true
  }

  hasNextMove: boolean;

  move: PlayerMove

  grow: boolean;
}
