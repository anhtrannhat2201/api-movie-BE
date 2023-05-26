import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// import prisma
import { NguoiDung, PrismaClient } from '@prisma/client';
import { nguoiDungSelectNoPass } from '../../../prisma/prisma-select';
const prisma = new PrismaClient();

// import bcrypt
import * as bcrypt from 'bcrypt';

// import local DTO
import {
  CreateNguoiDungDto,
  LoaiNguoiDung,
  NguoiDungDto,
  UpdateNguoiDungDto,
  UpdateNguoiDungDtoAdmin,
} from './user-dto/user.dto';
import { PaginationResDto } from '../../dto/index.dto';

// custom response
import { PagiRes } from '../../common/models/responseModel';

@Injectable()
export class UsersService {
  constructor(private readonly configService: ConfigService) { }

  // GET user information by Email
  async getUserByEmail(email: string): Promise<NguoiDung> {
    const user = await prisma.nguoiDung.findFirst({
      where: { email, isRemoved: false },
    });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Người dùng với email này không tồn tại',
        error: { email },
      });
    }
    return user;
  }

  // Create new user
  async create(userData: CreateNguoiDungDto) {
    const newUser = await prisma.nguoiDung.create({ data: userData });
    return newUser;
  }

  // LẤY Danh Sách loại người dùng
  getUserRole() {
    return Object.values(LoaiNguoiDung);
  }

  // LẤY Danh Sách người dùng
  async getUserList(): Promise<NguoiDungDto[]> {
    return await prisma.nguoiDung.findMany({
      where: { isRemoved: false },
      select: nguoiDungSelectNoPass,
    });
  }

  // TÌM KIẾM danh sách người dùng bằng hoTen
  async getUsersByName(tuKhoa: string): Promise<NguoiDungDto[]> {
    return await prisma.nguoiDung.findMany({
      where: { hoTen: { contains: tuKhoa }, isRemoved: false },
      select: nguoiDungSelectNoPass,
    });
  }

  // TÌM KIẾM danh sách người dùng bằng hoTen và phân trang
  async getUsersPagination(
    tuKhoa: string,
    currentPage: number,
    itemsPerPage: number,
  ): Promise<PaginationResDto<NguoiDungDto>> {
    const [userList, totalItems] = await Promise.all([
      prisma.nguoiDung.findMany({
        where: { hoTen: { contains: tuKhoa }, isRemoved: false },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        select: nguoiDungSelectNoPass,
      }),
      prisma.nguoiDung.count({
        where: { hoTen: { contains: tuKhoa }, isRemoved: false },
      }),
    ]);

    return new PagiRes<NguoiDungDto>({
      currentPage,
      itemsPerPage,
      totalItems,
      items: userList,
    }).res();
  }

  // LẤY thông tin người dùng bằng ID
  async getUserInfoById(taiKhoan: number): Promise<NguoiDungDto | null> {
    return await prisma.nguoiDung.findFirst({
      where: { taiKhoan, isRemoved: false },
      select: nguoiDungSelectNoPass,
    });
  }

  // CẬP NHẬT Thông tin người dùng (user)
  async updateUser(
    updateUserInput: UpdateNguoiDungDto,
    taiKhoan: number,
  ): Promise<NguoiDungDto> {
    const { matKhauMoi, emailMoi, ...userInfo } = updateUserInput;
    if (matKhauMoi) {
      userInfo.matKhau = bcrypt.hashSync(
        matKhauMoi,
        Number(this.configService.get('BCRYPT_SALT')),
      );
    }
    if (emailMoi) {
      userInfo.email = emailMoi;
    }

    const updatedUser = await prisma.nguoiDung.update({
      where: { taiKhoan },
      data: userInfo,
    });
    delete updatedUser.matKhau;
    delete updatedUser.isRemoved;
    return updatedUser;
  }

  // CẬP NHẬT Thông tin người dùng (admin)
  async updateUserAdmin(
    userInfo: UpdateNguoiDungDtoAdmin,
  ): Promise<NguoiDungDto> {
    userInfo.matKhau = bcrypt.hashSync(
      userInfo.matKhau,
      Number(this.configService.get('BCRYPT_SALT')),
    );
    const updatedUser = await prisma.nguoiDung.update({
      where: { taiKhoan: userInfo.taiKhoan },
      data: userInfo,
    });
    delete updatedUser.matKhau;
    delete updatedUser.isRemoved;
    return updatedUser;
  }

  // XÓA người dùng
  async deleteUser(taiKhoan: number) {
    await prisma.nguoiDung.delete({ where: { taiKhoan } });
    return 'Đã xóa người dùng thành công';
  }
}
