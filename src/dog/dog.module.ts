import { Module } from '@nestjs/common';
import { DogController } from './dog.controller';

@Module({
  imports: [],
  controllers: [DogController],
  providers: [],
  exports: [],
})
export class DogModule {}
