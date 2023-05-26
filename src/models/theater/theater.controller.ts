import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

// import local services
import { TheatreService } from './theater.service';

// import local DTO
import { TheatreChainDto } from './theater-dto/theater.dto';

@Controller('QuanLyRap')
@ApiTags('Quản lý rạp')
export class TheatreController {
  constructor(private readonly theatreService: TheatreService) { }

  @Get('LayThongTinHeThongRap')
  @ApiQuery({ name: 'maHeThongRap', required: false })
  async getTheatreChain(
    @Query('maHeThongRap') maHeThongRap: string,
  ): Promise<TheatreChainDto[]> {
    const maHeThong = maHeThongRap === '' ? undefined : maHeThongRap;
    return await this.theatreService.getTheatreChain(maHeThong);
  }

  @Get('LayThongTinCumRap/:maHeThongRap')
  async getTheatreList(@Param('maHeThongRap') maHeThongRap: string) {
    return await this.theatreService.getTheatreList(maHeThongRap);
  }

  @Get('LayThongTinLichChieuPhim/:maPhim')
  async getScreenSchedule(@Param('maPhim', ParseIntPipe) maPhim: number) {
    return await this.theatreService.getScreenSchedule(maPhim);
  }

  @Get('LayThongTinLichChieuTheoHeThongRap')
  @ApiQuery({ name: 'maHeThongRap', required: false })
  async getScheduleByChain(@Query('maHeThongRap') maHeThongRap: string) {
    const maHeThong = maHeThongRap === '' ? undefined : maHeThongRap;
    return await this.theatreService.getScheduleByChain(maHeThong);
  }
}
