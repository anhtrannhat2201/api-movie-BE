import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';

// import prisma
import { CumRap, Ghe, HeThongRap, LichChieu, RapPhim } from '@prisma/client';

// import local DTO
import { MovieDto } from '../../../dto/index.dto';

// import validator and transformer
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class TheatreChainEntity implements HeThongRap {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  maHeThongRap: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tenHeThongRap: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  logo: string;

  @IsOptional()
  @ApiPropertyOptional()
  cumRap?: TheatreDto[];

  @Exclude()
  @IsBoolean()
  isRemoved: boolean;
}

export class TheatreEntity implements CumRap {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  maCumRap: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tenCumRap: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  diaChi: string;

  @IsOptional()
  @ApiPropertyOptional()
  rapPhim?: TheatreRoomDto[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  maHeThongRap: string;

  @Exclude()
  @IsBoolean()
  isRemoved: boolean;
}

export class TheatreRoomEntity implements RapPhim {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maRap: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tenRap: string;

  @IsOptional()
  @ApiPropertyOptional()
  ghe?: SeatDto[];

  @IsOptional()
  @ApiPropertyOptional()
  lichChieu?: ScheduleDto[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  maCumRap: string;

  @Exclude()
  @IsBoolean()
  isRemoved: boolean;
}
export class TheatreRoomDto extends OmitType(TheatreRoomEntity, [
  'isRemoved',
]) {}

export class ScheduleEntity implements LichChieu {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maLichChieu: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maRap: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maPhim: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  ngayGioChieu: string;

  @IsOptional()
  @ApiPropertyOptional()
  rapPhim?: TheatreRoomDto;

  @IsOptional()
  @ApiPropertyOptional()
  phim?: MovieDto;

  @Exclude()
  @IsBoolean()
  isRemoved: boolean;
}

export class SeatEntity implements Ghe {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maGhe: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tenGhe: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  loaiGhe: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maRap: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  giaVe: number;

  @Exclude()
  @IsBoolean()
  isRemoved: boolean;
}

export class TheatreChainDto extends OmitType(TheatreChainEntity, [
  'isRemoved',
]) {}

export class TheatreDto extends OmitType(TheatreEntity, ['isRemoved']) {}

export class ScheduleDto extends OmitType(ScheduleEntity, ['isRemoved']) {}
export class ScheduleOutputDto extends PickType(ScheduleEntity, [
  'maLichChieu',
  'maRap',
  'ngayGioChieu',
]) {
  tenRap: string;
}
export class CreateScheduleDto extends OmitType(ScheduleEntity, [
  'maLichChieu',
  'rapPhim',
  'phim',
  'isRemoved',
]) {}

export class SeatDto extends OmitType(SeatEntity, ['isRemoved']) {}

export class lichChieuCumRapRawDto {
  maCumRap: string;
  tenCumRap: string;
  diaChi: string;
  rapPhim: {
    maRap: number;
    tenRap: string;
    lichChieu: {
      maRap: number;
      maLichChieu: number;
      maPhim: number;
      ngayGioChieu: string;
    }[];
  }[];
}
export class lichChieuCumRapDto {
  maCumRap: string;
  tenCumRap: string;
  diaChi: string;
  lichChieuPhim: {
    maLichChieu: number;
    maRap: number;
    tenRap: string;
    ngayGioChieu: string;
  }[];
}
export class lichChieuPhimRawDto {
  maHeThongRap: string;
  tenHeThongRap: string;
  logo: string;
  cumRap: Array<lichChieuCumRapRawDto>;
}
export class lichChieuPhimDto {
  maHeThongRap: string;
  tenHeThongRap: string;
  logo: string;
  cumRap: Array<lichChieuCumRapDto>;
}
