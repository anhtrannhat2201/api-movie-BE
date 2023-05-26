import { Module } from '@nestjs/common';
import { TheatreController } from './theater.controller';
import { TheatreService } from './theater.service';

@Module({
  controllers: [TheatreController],
  providers: [TheatreService]
})
export class TheatreModule { }
