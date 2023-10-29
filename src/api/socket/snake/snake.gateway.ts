import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class SnakeGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket): void {
    console.log(`Connected client with id: ${socket.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() message: string): boolean {
    console.log(`client with id: ${socket.id} broadcasted message: ${JSON.stringify(message)}`)

    return socket.broadcast.emit('message', { data: 'hello!!!' })
  }
}
