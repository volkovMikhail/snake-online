import { Injectable, OnModuleInit } from '@nestjs/common';
import { Chunk, Game, Player } from './models';

@Injectable()
export class SnakeService implements OnModuleInit {
  game: Game;

  onModuleInit() {
    this.game = new Game(25);
  }

  addPlayer(clientId: string, player: Player): void {
    this.game.players.set(clientId, player);
  }

  removePlayer(clientId: string): void {
    this.game.players.delete(clientId);
  }

  growSnakeBody(clientId: string): void {
    const player = this.game.players.get(clientId);
    const snake = player.snake;

    const head = snake.body[snake.body.length - 1];

    snake.body.push(new Chunk(head.x, head.y));
  }
}
