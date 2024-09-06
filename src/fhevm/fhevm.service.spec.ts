import { Test, TestingModule } from '@nestjs/testing';
import { FhevmService } from './fhevm.service';

describe('FhevmService', () => {
  let service: FhevmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FhevmService],
    }).compile();

    service = module.get<FhevmService>(FhevmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
