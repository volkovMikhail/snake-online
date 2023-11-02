import { Module } from '@nestjs/common';
import { SnakeGateway } from './snake.gateway';
import { SnakeService } from './snake.service';

@Module({
  providers: [SnakeGateway, SnakeService]
})
export class SnakeModule {}
