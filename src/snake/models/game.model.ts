import { Chunk } from './chunk.model';
import { Player } from './player.model';

export class Game {
  constructor(
    chunkSize: number,
    cnvHeight: number,
    cnvWidth: number,
  ) {
    this.cnvHeight = cnvHeight;
    this.cnvWidth = cnvWidth;

    this.chunkSize = chunkSize;

    this.players = new Map<string, Player>();

    this.updates = {}
  }

  public cnvHeight: number;
  public cnvWidth: number;

  public chunkSize: number;

  public fruit: Chunk;

  public players: Map<string, Player>;

  public updates: Record<string, Chunk[]>;
}
