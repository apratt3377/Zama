import { Module } from '@nestjs/common';
import { FhevmService } from './fhevm.service';
import { FhevmController } from './fhevm.controller';

@Module({
  controllers: [FhevmController],
  providers: [FhevmService],
})
export class FhevmModule {}
