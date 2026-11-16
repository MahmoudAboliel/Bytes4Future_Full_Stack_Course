import { Module } from '@nestjs/common';
import { ActorsService } from './actors.service.js';
import { ActorsController } from './actors.controller.js';

@Module({
  controllers: [ActorsController],
  providers: [ActorsService],
})
export class ActorsModule {}
