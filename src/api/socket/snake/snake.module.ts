import { Module } from '@nestjs/common';
import { SnakeGateway } from './snake.gateway';

@Module({
  providers: [SnakeGateway]
})
export class SnakeGatewayModule {}
