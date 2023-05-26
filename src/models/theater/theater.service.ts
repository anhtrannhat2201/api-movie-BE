import { Injectable, NotFoundException } from '@nestjs/common';

// import Prisma
import { Prisma, PrismaClient } from '@prisma/client';
import {
  phimSelect,
  lichChieuSelect,
  theatreChainSelect,
} from '../../../prisma/prisma-select';
import { MovieDto } from '../../dto/index.dto';
const prisma = new PrismaClient();

// import local DTO
import {
  lichChieuPhimRawDto,
  lichChieuPhimDto,
  TheatreChainDto,

  ScheduleOutputDto,
} from './theater-dto/theater.dto';

@Injectable()
export class TheatreService {
  // LẤY Thông tin Hệ Thống Rạp
  async getTheatreChain(maHeThongRap: string): Promise<TheatreChainDto[]> {
    return await prisma.heThongRap.findMany({
      where: { maHeThongRap, isRemoved: false },
      select: theatreChainSelect,
    });
  }

  // LẤY Thông tin Cụm rạp có trong Hệ Thống Rạp
  async getTheatreList(maHeThongRap: string) {
    const theatreList = await prisma.cumRap.findMany({
      where: { maHeThongRap, isRemoved: false },
      select: {
        maCumRap: true,
        tenCumRap: true,
        diaChi: true,
        rapPhim: { select: { maRap: true, tenRap: true } },
      },
    });

    if (theatreList.length === 0) {
      throw new NotFoundException('maHeThongRap does not exist');
    }
    return theatreList;
  }

  // LẤY Thông tin lịch chiếu Phim
  async getScreenSchedule(maPhim: number) {
    const [movieInfo, lichChieuRaw]: [MovieDto, lichChieuPhimRawDto[]] =
      await Promise.all([
        prisma.phim.findFirst({
          where: { maPhim, isRemoved: false },
          select: phimSelect,
        }),
        prisma.heThongRap.findMany({
          where: {
            cumRap: {
              some: { rapPhim: { some: { lichChieu: { some: { maPhim } } } } },
            },
            isRemoved: false,
          },
          select: {
            maHeThongRap: true,
            tenHeThongRap: true,
            logo: true,
            cumRap: {
              where: {
                rapPhim: { some: { lichChieu: { some: { maPhim } } } },
                isRemoved: false,
              },
              select: {
                maCumRap: true,
                tenCumRap: true,
                diaChi: true,
                rapPhim: {
                  where: { lichChieu: { some: { maPhim } }, isRemoved: false },
                  select: {
                    maRap: true,
                    tenRap: true,
                    lichChieu: {
                      where: { maPhim, isRemoved: false },
                      select: lichChieuSelect,
                    },
                  },
                },
              },
            },
          },
        }),
      ]);

    if (!movieInfo) {
      throw new NotFoundException('Không tìm thấy phim');
    }

    // map lại thông tin lịch chiếu để được output như yêu cầu
    const lichChieuFinal: lichChieuPhimDto[] = lichChieuRaw.map((heThong) => ({
      maHeThongRap: heThong.maHeThongRap,
      tenHeThongRap: heThong.tenHeThongRap,
      logo: heThong.logo,
      cumRap: heThong.cumRap.map((cr) => {
        // sử dụng hàm reduce để gộp các Array (lichChieuList ngay bên dưới) lại thành một Array duy nhất (lichChieuPhim)
        const lichChieuPhim = cr.rapPhim.reduce<Array<ScheduleOutputDto>>(
          (accu, curr) => {
            // map lại lichChieu ở trong rapPhim
            const lichChieuList = curr.lichChieu.map((item) => ({
              maLichChieu: item.maLichChieu,
              maRap: item.maRap,
              tenRap: curr.tenRap,
              ngayGioChieu: item.ngayGioChieu,
            }));
            return [...accu, ...lichChieuList];
          },
          [],
        );
        lichChieuPhim.sort(
          (a, b) => Date.parse(a.ngayGioChieu) - Date.parse(b.ngayGioChieu),
        );
        return {
          maCumRap: cr.maCumRap,
          tenCumRap: cr.tenCumRap,
          diaChi: cr.diaChi,
          lichChieuPhim,
        };
      }),
    }));
    return { ...movieInfo, heThongRap: lichChieuFinal };


  }

  // LẤY Thông tin Lịch chiếu theo hệ thống rạp
  async getScheduleByChain(maHeThongRap: string) {
    const heThongRapList = await prisma.heThongRap.findMany({
      where: { maHeThongRap, isRemoved: false },
      select: {
        maHeThongRap: true,
        tenHeThongRap: true,
        logo: true,
        cumRap: {
          where: {
            isRemoved: false,
            rapPhim: { some: { lichChieu: { some: {} } } },
          },
          select: {
            maCumRap: true,
            tenCumRap: true,
            diaChi: true,
          },
        },
      },
    });

    if (heThongRapList.length === 0) {
      throw new NotFoundException('Mã hệ thống rạp không tồn tại');
    }

    // Lấy toàn bộ phim trong cụm rạp và lịch chiếu trong cụm rạp (của các phim đó)
    const getMovieAndSchedule = async (maCumRap: string) => {
      const movieListRaw = await prisma.phim.findMany({
        where: {
          lichChieu: { some: { rapPhim: { maCumRap, isRemoved: false } } },
          isRemoved: false,
        },
        select: {
          ...phimSelect,
          lichChieu: {
            where: {
              rapPhim: { maCumRap, isRemoved: false },
              isRemoved: false,
            },
            select: {
              maLichChieu: true,
              maRap: true,
              ngayGioChieu: true,
              rapPhim: { select: { tenRap: true } },
            },
            orderBy: { ngayGioChieu: 'asc' },
          },
        },
      });

      const movieList = movieListRaw.map((movie) => {
        const { lichChieu, ...movieInfo } = movie;
        const lichChieuOutput = lichChieu.map((lc) => ({
          maLichChieu: lc.maLichChieu,
          maRap: lc.maRap,
          tenRap: lc.rapPhim.tenRap,
          ngayGioChieu: lc.ngayGioChieu,
        }));
        return { ...movieInfo, lichChieuPhim: lichChieuOutput };
      });

      return movieList;
    };

    const lichChieuFinal = await Promise.all(
      heThongRapList.map(async (heThong) => ({
        maHeThongRap: heThong.maHeThongRap,
        tenHeThongRap: heThong.tenHeThongRap,
        logo: heThong.logo,
        cumRap: await Promise.all(
          heThong.cumRap.map(async (cr) => ({
            maCumRap: cr.maCumRap,
            tenCumRap: cr.tenCumRap,
            diaChi: cr.diaChi,
            phim: await getMovieAndSchedule(cr.maCumRap),
          })),
        ),
      })),
    );

    return lichChieuFinal;
  }
}
