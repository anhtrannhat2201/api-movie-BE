import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

// import prisma class
import { Banner, Phim } from '@prisma/client';

// import validator and transform
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Opposite } from '../../../common/decorators/opposite.decorator';

export class MovieEntity implements Phim {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maPhim: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tenPhim: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  trailer: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  hinhAnh: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  moTa: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  ngayKhoiChieu: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  @ApiPropertyOptional()
  danhGia: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  hot: boolean;

  @IsBoolean()
  @ApiProperty({ default: false })
  dangChieu: boolean;

  @IsBoolean()
  @ApiProperty({ default: true })
  @Opposite(MovieEntity, (s) => s.dangChieu)
  sapChieu: boolean;

  @Exclude()
  @IsBoolean()
  isRemoved: boolean;
}

export class BannerEntity implements Banner {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maBanner: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maPhim: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  hinhAnh: string;

  @Exclude()
  isRemoved: boolean;
}

export class BannerDto extends OmitType(BannerEntity, ['isRemoved']) {}

export class MovieDto extends OmitType(MovieEntity, ['isRemoved']) {}
export class CreateMovieDto extends OmitType(MovieEntity, [
  'isRemoved',
  'maPhim',
]) {}
export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  maPhim: number;
}
