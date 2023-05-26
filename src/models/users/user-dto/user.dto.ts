import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { NguoiDung } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import {
  IsNumber,
  IsEmail,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum LoaiNguoiDung {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

@Exclude()
export class NguoiDungEntity implements NguoiDung {
  @IsNumber()
  @ApiProperty()
  @Expose()
  taiKhoan: number;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  matKhau: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  hoTen: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  soDT: string;

  @IsEnum(LoaiNguoiDung)
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  loaiNguoiDung: string;

  @Exclude()
  isRemoved: boolean;
}

export class LoginInfoDto extends PickType(NguoiDungEntity, [
  'email',
  'matKhau',
]) {}

export class NguoiDungDto extends OmitType(NguoiDungEntity, [
  'matKhau',
  'isRemoved',
]) {}

export class CreateNguoiDungDto extends OmitType(NguoiDungEntity, [
  'taiKhoan',
  'loaiNguoiDung',
  'isRemoved',
]) {}

export class UpdateNguoiDungDto extends PickType(NguoiDungEntity, [
  'email',
  'matKhau',
]) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  hoTen?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  soDT?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @ApiPropertyOptional()
  emailMoi?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  matKhauMoi?: string;
}

export class CreateNguoiDungDtoAdmin extends OmitType(NguoiDungEntity, [
  'taiKhoan',
  'isRemoved',
]) {}

export class UpdateNguoiDungDtoAdminAll extends OmitType(NguoiDungEntity, [
  'taiKhoan',
  'isRemoved',
]) {}
export class UpdateNguoiDungDtoAdmin extends PartialType(
  UpdateNguoiDungDtoAdminAll,
) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  taiKhoan: number;
}
