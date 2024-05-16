import { Test, TestingModule } from '@nestjs/testing';
import { IsUpController } from './is-up.controller';
import { IsUpService } from './is-up.service';

describe('IsUpController', () => {
  let controller: IsUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IsUpController],
      providers: [IsUpService],
    }).compile();

    controller = module.get<IsUpController>(IsUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
