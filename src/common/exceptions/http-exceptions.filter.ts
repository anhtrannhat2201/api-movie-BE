import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (typeof exception.getResponse() === 'string') {
      res.status(status).json({
        statusCode: status,
        message: exception.message,
        error: exception.getResponse(),
      });
      return;
    }
    res.status(status).json(exception.getResponse());
  }
}
