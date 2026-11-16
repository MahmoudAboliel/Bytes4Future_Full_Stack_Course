import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { MoviesService } from './movies/movies.service.js';
import { ActorsModule } from './actors/actors.module.js';

@Module({
  imports: [UserModule, ActorsModule],
  controllers: [AppController],
  providers: [AppService, MoviesService],
})
export class AppModule {}
