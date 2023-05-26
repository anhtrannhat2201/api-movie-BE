import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';

// import prisma model
import { DatVe } from '@prisma/client';

// import validator
import { Exclude, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

// import local DTO
import { NguoiDungDto } from '../../../dto/index.dto';
import { ScheduleDto, SeatDto } from '../../../dto/index.dto';

export class BookingEntity implements DatVe {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  taiKhoan: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maLichChieu: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maGhe: number;

  @Exclude()
  @IsBoolean()
  isRemoved: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  nguoiDung?: NguoiDungDto;

  @IsOptional()
  @ApiPropertyOptional()
  lichChieu?: ScheduleDto;

  @IsOptional()
  @ApiPropertyOptional()
  ghe?: SeatDto;
}

export class BookingDto extends OmitType(BookingEntity, ['isRemoved']) { }
export class CreateBookingDto extends PickType(BookingEntity, [
  'maLichChieu',
  'maGhe',
]) { }



export class CreateManyBookingDto extends PickType(BookingEntity, [
  'maLichChieu',
]) {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({ type: [Number] })
  danhSachGhe: number[];
}