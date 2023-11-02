import { Chunk } from "./chunk.model";
import { Player } from "./player.model";

export class Game {
  constructor(public chunkSize: number){}

  fruit: Chunk;

  players: Map<string, Player>;
}