import {
  Controller,
  Req,
  Body,
  Get,
  Post,
  Put,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  NotFoundException,
  Delete,
  ConflictException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

// import local DTO
import {
  PaginationQuery,
  PaginationResDto,
  RequestWithUser,
} from '../../dto/index.dto';
import {
  CreateNguoiDungDtoAdmin,
  LoaiNguoiDung,
  NguoiDungDto,
  UpdateNguoiDungDto,
  UpdateNguoiDungDtoAdmin,
} from './user-dto/user.dto';

// import local service
import { UsersService } from './users.service';
import { AuthService } from '../../auth/auth.service';

// import local decorator
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('QuanLyNguoiDung')
@ApiTags('Quản lí người dùng')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(LoaiNguoiDung.ADMIN)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Get('LayDanhSachLoaiNguoiDung')
  getUserRoles(): LoaiNguoiDung[] {
    return this.usersService.getUserRole();
  }

  @Get('LayDanhSachNguoiDung')
  async getUserList(): Promise<NguoiDungDto[]> {
    return await this.usersService.getUserList();
  }

  @Get('TimKiemNguoiDung')
  @ApiQuery({ name: 'tuKhoa', required: false })
  async getUserByName(
    @Query('tuKhoa', new DefaultValuePipe('')) tuKhoa: string,
  ): Promise<NguoiDungDto[]> {
    return await this.usersService.getUsersByName(tuKhoa);
  }

  @Get('TimKiemNguoiDungPhanTrang')
  async getUsersPagination(
    @Query()
    { tuKhoa, currentPage, itemsPerPage }: PaginationQuery,
  ): Promise<PaginationResDto<NguoiDungDto>> {
    return this.usersService.getUsersPagination(
      tuKhoa,
      currentPage,
      itemsPerPage,
    );
  }

  @Get('ThongTinTaiKhoan')
  @Roles(LoaiNguoiDung.USER, LoaiNguoiDung.ADMIN)
  getUserInfo(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get('LayThongTinNguoiDung/:taiKhoan')
  async getUserInfoById(
    @Param('taiKhoan', ParseIntPipe) tai_khoan: number,
  ): Promise<NguoiDungDto> {
    const user = await this.usersService.getUserInfoById(tai_khoan);
    if (user) {
      return user;
    }
    throw new NotFoundException('Người dùng không tồn tại');
  }

  @Post('ThemNguoiDung')
  async addUser(@Body() userInfo: CreateNguoiDungDtoAdmin) {
    return await this.authService.signup(userInfo);
  }

  @Put('CapNhatThongTinNguoiDung')
  async updateUser(
    @Req() req: RequestWithUser,
    @Body() body: UpdateNguoiDungDto,
  ): Promise<NguoiDungDto> {
    const { taiKhoan, email } = req.user;
    if (email !== body.email) {
      throw new ConflictException(
        'Email không khớp với token được cung cấp',
      );
    }
    await this.authService.validateUser({ email, matKhau: body.matKhau });
    return await this.usersService.updateUser(body, taiKhoan);
  }

  @Put('CapNhatThongTinNguoiDungAdmin')
  async updateUserAdmin(
    @Body() body: UpdateNguoiDungDtoAdmin,
  ): Promise<NguoiDungDto> {
    return await this.usersService.updateUserAdmin(body);
  }

  @Delete('XoaNguoiDung/:taiKhoan')
  async deleteUser(
    @Param('taiKhoan', ParseIntPipe) taiKhoan: number,
  ): Promise<string> {
    return await this.usersService.deleteUser(taiKhoan);
  }
}
