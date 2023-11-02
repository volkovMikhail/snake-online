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

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class SnakeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket): void {
    console.log(`Client with id: ${socket.id} connected `);
  }

  handleDisconnect(socket: Socket): void {
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
