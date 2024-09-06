import { Controller, Get } from '@nestjs/common';
import { FhevmService } from './fhevm.service';

@Controller('fhevm')
export class FhevmController {
  constructor(private readonly fhevmService: FhevmService) {}

  @Get()
  fhevm() {
    return this.fhevmService.testFhevm();
  }
}
