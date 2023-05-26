import { Request } from 'express';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// import prisma
import { PrismaClient } from '@prisma/client';
import { bannerSelect, phimSelect } from '../../../prisma/prisma-select';
const prisma = new PrismaClient();

// import local DTO
import {
  BannerDto,
  CreateMovieDto,
  MovieDto,
  UpdateMovieDto,
  PaginationMovieQuery,
  PaginationResDto,
} from '../../dto/index.dto';

// custom response
import { PagiRes } from '../../common/models/responseModel';
import { getFileUrl } from '../../common/utils/utils';

@Injectable()
export class MovieService {
  constructor(private readonly configService: ConfigService) {}

  // LẤY Danh sách Banner
  async getBanner(): Promise<BannerDto[]> {
    return await prisma.banner.findMany({
      where: { isRemoved: false },
      select: bannerSelect,
    });
  }

  // LẤY Thông tin Phim
  async getMovieInfo(maPhim: number): Promise<MovieDto> {
    const movieInfo = await prisma.phim.findFirst({
      where: { maPhim, isRemoved: false },
      select: phimSelect,
      orderBy: { ngayKhoiChieu: 'asc' },
    });

    if (!movieInfo) throw new NotFoundException('Movie is not found.');
    return movieInfo;
  }

  // LẤY Danh sách Phim theo Tên
  async getMovieList(tenPhim: string): Promise<MovieDto[]> {
    return await prisma.phim.findMany({
      where: { tenPhim: { contains: tenPhim }, isRemoved: false },
      select: phimSelect,
    });
  }

  // LẤY Danh sách phim theo tên Phim, theo ngày Công Chiêu & Phân trang
  async getMoviePagination(
    query: PaginationMovieQuery,
  ): Promise<PaginationResDto<MovieDto>> {
    const { tenPhim, currentPage, itemsPerPage, fromDate, toDate } = query;

    // lấy danh sách phim theo trang & đếm tổng số lượng phim (toàn bộ phim, không theo trang)
    const [movieList, totalItems] = await Promise.all([
      prisma.phim.findMany({
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        where: {
          tenPhim: { contains: tenPhim },
          ngayKhoiChieu: { gte: fromDate, lte: toDate },
          isRemoved: false,
        },
        select: phimSelect,
        orderBy: { ngayKhoiChieu: 'asc' },
      }),
      prisma.phim.count({
        where: {
          tenPhim: { contains: tenPhim },
          ngayKhoiChieu: { gte: fromDate, lte: toDate },
          isRemoved: false,
        },
      }),
    ]);

    return new PagiRes<MovieDto>({
      currentPage,
      itemsPerPage,
      totalItems,
      items: movieList,
    }).res();
  }

  // UPLOAD Hình Phim
  async uploadImage(req: Request, maPhim: number, filename: string) {
    const fileUrl = getFileUrl(
      req,
      this.configService.get('MOVIE_URL'),
      filename,
    );

    await prisma.phim.update({
      data: { hinhAnh: fileUrl },
      where: { maPhim },
    });

    return { fileUrl };
  }

  // THÊM Phim mới
  async createMovie(movieInfo: CreateMovieDto): Promise<MovieDto> {
    return await prisma.phim.create({ data: movieInfo, select: phimSelect });
  }

  // CẬP NHẬT Phim
  async updateMovie(updateInfo: UpdateMovieDto): Promise<MovieDto> {
    return await prisma.phim.update({
      where: { maPhim: updateInfo.maPhim },
      data: updateInfo,
      select: phimSelect,
    });
  }

  // XÓA Phim
  async deleteMovie(maPhim: number): Promise<MovieDto> {
    return await prisma.phim.delete({ where: { maPhim }, select: phimSelect });
  }
}
