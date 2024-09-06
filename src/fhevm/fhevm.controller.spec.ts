import { Test, TestingModule } from '@nestjs/testing';
import { FhevmController } from './fhevm.controller';
import { FhevmService } from './fhevm.service';

describe('FhevmController', () => {
  let controller: FhevmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FhevmController],
      providers: [FhevmService],
    }).compile();

    controller = module.get<FhevmController>(FhevmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
