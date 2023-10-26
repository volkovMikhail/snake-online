import {
  MessageBody,
  OnGatewayConnection,
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
export class SnakeGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): boolean {
    return this.server.emit('message', { clientId: client.id });
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, @MessageBody() message: string): boolean {
    return this.server.emit('message', { clientId: client.id, message });
  }
}
