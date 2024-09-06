import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FhevmModule } from './fhevm/fhevm.module';

@Module({
  imports: [FhevmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
