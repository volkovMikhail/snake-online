import { Module } from '@nestjs/common';
import { SnakeGatewayModule } from './snake/snake.module';

@Module({
  imports: [SnakeGatewayModule]
})
export class SocketModule {}
