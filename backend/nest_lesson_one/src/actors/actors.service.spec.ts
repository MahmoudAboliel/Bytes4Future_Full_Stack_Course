import { Test, TestingModule } from '@nestjs/testing';
import { ActorsService } from './actors.service.js';

describe('ActorsService', () => {
  let service: ActorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActorsService],
    }).compile();

    service = module.get<ActorsService>(ActorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
