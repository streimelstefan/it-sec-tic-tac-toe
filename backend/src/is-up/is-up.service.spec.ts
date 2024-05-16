import { Test, TestingModule } from '@nestjs/testing';
import { IsUpService } from './is-up.service';

describe('IsUpService', () => {
  let service: IsUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IsUpService],
    }).compile();

    service = module.get<IsUpService>(IsUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
