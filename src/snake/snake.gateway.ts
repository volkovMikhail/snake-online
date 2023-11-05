import { OnApplicationBootstrap } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SnakeService } from './snake.service';
import { EventType, SubscribeEventType } from './types';
import { Chunk } from './models';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class SnakeGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnApplicationBootstrap
{
  constructor(private readonly snakeService: SnakeService) {}

  @WebSocketServer()
  server: Server;

  interval = 100;

  onApplicationBootstrap() {
    console.log(this.snakeService);
    setInterval(this.gameTick.bind(this), this.interval);
  }

  gameTick(): void {
    if (this.snakeService.checkNextMoves()) {
      this.server.emit(EventType.NEXT_MOVE, this.snakeService.getUpdates());
      console.log(this.snakeService.getUpdates());
      this.snakeService.clearUpdates();
    }
  }

  handleConnection(socket: Socket): void {
    console.log(`Client with id: ${socket.id} connected `);

    this.snakeService.addPlayer(socket.id);

    const game = this.snakeService.getGameInfo(socket.id);

    socket.emit(EventType.GAME_INFO, game);
  }

  handleDisconnect(socket: Socket): void {
    console.log(`Client with id: ${socket.id} disconnected`);

    this.snakeService.removePlayer(socket.id);
  }

  @SubscribeMessage(SubscribeEventType.PLAYER_MOVE)
  handleMove(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: Chunk
  ): boolean {
    this.snakeService.addPlayerMove(socket.id, message);

    return socket.broadcast.emit(SubscribeEventType.PLAYER_MOVE, {
      id: socket.id,
      head: message
    });
  }

  @SubscribeMessage(SubscribeEventType.SNAKE_GROW)
  handleGrow(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: Chunk
  ): void {
    this.snakeService.growSnakeBody(socket.id);
  }
}
