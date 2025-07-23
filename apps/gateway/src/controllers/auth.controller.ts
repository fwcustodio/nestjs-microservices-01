import { Controller, Post, Body, Get, UseGuards, Request, Put, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() registerDto: any) {
    return this.authService.send({ cmd: 'register' }, registerDto);
  }

  @Post('login')
  login(@Body() loginDto: any) {
    return this.authService.send({ cmd: 'login' }, loginDto);
  }

  @Post('validate')
  validateToken(@Body('token') token: string) {
    return this.authService.send({ cmd: 'validate_token' }, token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.authService.send({ cmd: 'get_user_profile' }, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  changePassword(@Request() req: any, @Body() changePasswordDto: any) {
    return this.authService.send({ cmd: 'change_password' }, {
      ...changePasswordDto,
      userId: req.user.userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req: any) {
    return this.authService.send({ cmd: 'refresh_token' }, { userId: req.user.userId });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.send({ cmd: 'logout' }, token);
  }
}