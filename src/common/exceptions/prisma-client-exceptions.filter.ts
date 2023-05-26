import { Response } from 'express';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

// import prisma
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { prismaErrorCodes } from '../constants/prismaErrorCode.enum';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();


    switch (exception.code) {
      case prismaErrorCodes.outRange: {
        const status = HttpStatus.BAD_REQUEST;
        res.status(status).json({
          statusCode: status,
          message:
            "Giá trị được cung cấp cho cột quá dài đối với loại của cột",
          error: exception.meta ? exception.meta : exception.code,
        });
        break;
      }
      case prismaErrorCodes.unique: {
        const status = HttpStatus.CONFLICT;
        res.status(status).json({
          statusCode: status,
          message: 'Ràng buộc duy nhất không thành công',
          error: exception.meta ? exception.meta : exception.code,
        });
        break;
      }
      case prismaErrorCodes.foreignKey: {
        const status = HttpStatus.BAD_REQUEST;
        res.status(status).json({
          statusCode: status,
          message: 'Khóa ngoại không thành công. Bản ghi không tìm thấy',
          error: exception.meta ? exception.meta : exception.code,
        });
        break;
      }
      case prismaErrorCodes.notFound: {
        const status = HttpStatus.NOT_FOUND;
        res.status(status).json({
          statusCode: status,
          message: 'Không tìm thấy bản ghi được cung cấp',
          error: exception.meta ? exception.meta : exception.code,
        });
        break;
      }
      default:
        // default 500 error code
        // super.catch(exception, host);
        const status = HttpStatus.BAD_REQUEST;
        res.status(status).json({
          statusCode: status,
          message: `Không thành công khi thực hiện yêu cầu tại cơ sở dữ liệu. Prisma Error Code: ${exception.code}`,
          error: exception.meta ? exception.meta : exception.code,
        });
        break;
    }
  }
}
