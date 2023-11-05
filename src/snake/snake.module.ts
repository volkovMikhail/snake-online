import { Module } from '@nestjs/common';
import { SnakeGateway } from './snake.gateway';
import { SnakeService } from './snake.service';

@Module({
  providers: [SnakeService, SnakeGateway]
})
export class SnakeModule {}
