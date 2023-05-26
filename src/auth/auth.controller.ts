import { Controller, Post, Body, HttpCode } from '@nestjs/common';

// import local DTO
import { CreateNguoiDungDto, LoginInfoDto } from '../dto/index.dto';

// import local service
import { AuthService } from './auth.service';

// import Swagger
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginInfoDto): Promise<{ Authorization: string }> {
    const user = await this.authService.validateUser(body);
    const Authorization = await this.authService.login(user);
    return { Authorization };
  }

  @Post('signup')
  async signup(@Body() newUser: CreateNguoiDungDto): Promise<string> {
    return this.authService.signup(newUser);
  }
}
