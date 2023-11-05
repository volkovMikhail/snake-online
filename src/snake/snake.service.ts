import { Injectable, OnModuleInit } from '@nestjs/common';
import { Chunk, Game, Player, Snake } from './models';
import { GameInfoDto } from './dto';

@Injectable()
export class SnakeService implements OnModuleInit {
  private game: Game;

  onModuleInit() {
    this.game = new Game(25, 800, 800);

    this.game.fruit = new Chunk(this.randomX(), this.randomY());
  }

  getGameInfo(clientId: string): GameInfoDto {
    const snakes: Record<string, Snake> = {};

    for (const entry of this.game.players.entries()) {
      const [id, player] = entry;

      snakes[id] = player.snake;
    }

    return {
      id: clientId,
      playerSnakes: snakes
    };
  }

  checkNextMoves(): boolean {
    let res = true;

    this.game.players.forEach((player) => {
      if (!player.hasNextMove) {
        res = false;
      }
    });

    return res;
  }

  getUpdates(): Record<string, Chunk[]> {
    return this.game.updates;
  }

  clearUpdates(): void {
    Object.keys(this.game.updates).forEach((key) => {
      this.game.updates[key] = [];
    });
  }

  randomX(): number {
    return Math.round(
      Math.floor((Math.random() * this.game.cnvWidth) / this.game.chunkSize) *
        this.game.chunkSize
    );
  }

  randomY(): number {
    return Math.round(
      Math.floor((Math.random() * this.game.cnvHeight) / this.game.chunkSize) *
        this.game.chunkSize
    );
  }

  addPlayer(clientId: string): Player {
    console.log((this.game.chunkSize * (this.game.players.size + 1)));
    
    const startChunk = new Chunk(
      (this.game.chunkSize * (this.game.players.size + 1)),
      this.game.chunkSize
    );

    const player = new Player(startChunk);

    this.game.players.set(clientId, player);

    this.game.updates[clientId] = [];

    return player;
  }

  removePlayer(clientId: string): void {
    this.game.players.delete(clientId);
    delete this.game.updates[clientId];
  }

  growSnakeBody(clientId: string): void {
    const player = this.game.players.get(clientId);
    console.log(player);

    const snake = player.snake;

    const head = snake.body[snake.body.length - 1];

    const newChunk = new Chunk(head.x, head.y);
    snake.body.push(newChunk);

    this.game.updates[clientId].push(newChunk);
  }

  resetPlayerPos(clientId: string): void {
    const player = this.game.players.get(clientId);
    const snake = player.snake;

    snake.body = [player.startChunk];
  }

  addPlayerMove(clientId: string, newHead: Chunk): void {
    const player = this.game.players.get(clientId);
    const snake = player.snake;

    const newChunk = new Chunk(newHead.x, newHead.y);
    snake.body.push(newChunk);
    snake.body.splice(0, 1);

    player.hasNextMove = true;

    this.game.updates[clientId].push(newChunk);
  }

  removeNextMoveFlags(): void {
    this.game.players.forEach((player) => {
      player.hasNextMove = false;
    });
  }
}
