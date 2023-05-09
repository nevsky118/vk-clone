import { Body, Controller, Post, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthDto from './dtos/auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import RequestWithUser from 'src/common/request-with-user.interface';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() auth: AuthDto) {
    return this.authService.login(auth);
  }

  @Public()
  @Post('register')
  async register(@Body() user: UserDto) {
    return this.authService.register(user);
  }

  @Get('refresh')
  async refresh(@Request() req: RequestWithUser) {
    return await this.authService.refresh(
      req.headers.authorization.split(' ')[1],
    );
  }

  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return await this.authService.getProfile(req.user.sub);
  }
}
