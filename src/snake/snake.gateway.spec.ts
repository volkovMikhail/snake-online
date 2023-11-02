import { Test, TestingModule } from '@nestjs/testing';
import { SnakeGateway } from './snake.gateway';

describe('SnakeGateway', () => {
  let gateway: SnakeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnakeGateway],
    }).compile();

    gateway = module.get<SnakeGateway>(SnakeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
