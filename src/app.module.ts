import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// import local modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { MovieModule } from './models/movie/movie.module';
import { TheatreModule } from './models/theater/theater.module';
import { BookingModule } from './models/booking/booking.module';

// import local controllers
import { AppController } from './app.controller';

// import local services
import { AppService } from './app.service';

// import local filter
import { HttpExceptionFilter } from './common/exceptions/http-exceptions.filter';
import { PrismaClientExceptionFilter } from './common/exceptions/prisma-client-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    MovieModule,
    TheatreModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
})
export class AppModule { }
