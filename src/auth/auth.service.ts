import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// import local service
import { UsersService } from '../models/users/users.service';

// import prisma
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
const prisma = new PrismaClient();

// import local DTO
import {
  CreateNguoiDungDto,
  CreateNguoiDungDtoAdmin,
  LoginInfoDto,
  NguoiDungDto,
} from '../dto/index.dto';

// import bcrypt
import * as bcrypt from 'bcrypt';

// import error codes
import { prismaErrorCodes } from '../common/constants/prismaErrorCode.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) { }

  // USER VALIDATION - Is email and password correct
  async validateUser({ email, matKhau }: LoginInfoDto): Promise<NguoiDungDto> {
    const user = await this.usersService.getUserByEmail(email);

    const checkPass = bcrypt.compareSync(matKhau, user.matKhau);
    if (checkPass) {
      const { matKhau: password, isRemoved, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Incorrect Password');
  }

  // NGƯỜI DÙNG ĐĂNG NHẬP - Tạo authtoken
  async login(user: NguoiDungDto): Promise<string> {
    return this.jwtService.sign(user);
  }

  // ĐĂNG KÝ NGƯỜI DÙNG - Kiểm tra sự tồn tại và Tạo người dùng mới
  async signup(
    registerData: CreateNguoiDungDto | CreateNguoiDungDtoAdmin,
  ): Promise<string> {
    try {
      const hashedPass = bcrypt.hashSync(
        registerData.matKhau,
        Number(this.configService.get('BCRYPT_SALT')),
      );
      await this.usersService.create({
        ...registerData,
        matKhau: hashedPass,
      });
      return 'Người dùng được tạo thành công';
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === prismaErrorCodes.unique
      ) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'Người dùng với email này đã tồn tại.',
          error: err.meta ? err.meta : registerData,
        });
      }
      throw err;
    }
  }
}
