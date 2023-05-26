import { Request } from 'express';
import { ApiPropertyOptional } from '@nestjs/swagger';

// import class validator and class transformer
import { IsDateString, IsInt, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// import local DTO
import { NguoiDungDto } from './index.dto';

export interface RequestWithUser extends Request {
  user: NguoiDungDto;
}

export class PaginationQuery {
  @IsString()
  @ApiPropertyOptional()
  tuKhoa: string = '';

  @Transform(({ value }) => (value === 0 ? 1 : value))
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional()
  currentPage: number = 1;

  @Transform(({ value }) => (value === 0 ? 10 : value))
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional()
  itemsPerPage: number = 10;
}

export class PaginationMovieQuery {
  @IsString()
  @ApiPropertyOptional()
  tenPhim: string = '';

  @Type(() => Number)
  @Transform(({ value }) => (value === 0 ? 1 : value))
  @IsInt()
  @ApiPropertyOptional()
  currentPage: number = 1;

  @Type(() => Number)
  @Transform(({ value }) => (value === 0 ? 10 : value))
  @IsInt()
  @ApiPropertyOptional()
  itemsPerPage: number = 10;

  @Transform(({ value }) => (value === '' ? '1970-01-01' : value))
  @IsDateString()
  @ApiPropertyOptional()
  fromDate: string = '1970-01-01';

  @Transform(({ value }) => (value === '' ? '2099-01-01' : value))
  @IsDateString()
  @ApiPropertyOptional()
  toDate: string = '2099-01-01';
}

export class PaginationResDto<T> {
  currentPage: number;
  itemsOnThisPage: number;
  totalPages: number;
  totalItems: number;
  items: Array<T>;
}

export interface ResSuccess<T> {
  message: string;
  content: T;
}
