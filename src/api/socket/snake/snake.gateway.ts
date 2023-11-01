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
import { Player } from './models';
import { OnModuleInit } from '@nestjs/common';
import { EventType } from './types';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class SnakeGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  onModuleInit() {
    this.players = new Map<string, Player>();
  }

  players: Map<string, Player>;

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket): void {
    this.players.set(socket.id, new Player());

    socket.broadcast.emit(EventType.NEW_PLAYER, {
      playerNumber: this.players.size
    });
    console.log(`Client with id: ${socket.id} connected `);
  }

  handleDisconnect(socket: Socket): void {
    this.players.delete(socket.id);

    console.log(`Client with id: ${socket.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string
  ): boolean {
    console.log(
      `client with id: ${socket.id} broadcasted message: ${JSON.stringify(
        message
      )}`
    );

    return socket.broadcast.emit('message', { data: 'hello!!!' });
  }
}
