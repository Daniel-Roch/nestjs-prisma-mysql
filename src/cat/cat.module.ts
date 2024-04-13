import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';

@Module({
  imports: [],
  controllers: [CatController],
  providers: [],
  exports: [],
})
export class CatModule {}
