import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern({ cmd: 'validate_token' })
  validateToken(@Payload() token: string) {
    return this.authService.validateToken(token);
  }

  @MessagePattern({ cmd: 'get_user_profile' })
  getUserProfile(@Payload() userId: string) {
    return this.authService.getUserProfile(userId);
  }

  @MessagePattern({ cmd: 'change_password' })
  changePassword(@Payload() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @MessagePattern({ cmd: 'refresh_token' })
  refreshToken(@Payload() payload: { userId: string }) {
    return this.authService.refreshToken(payload.userId);
  }

  @MessagePattern({ cmd: 'logout' })
  logout(@Payload() token: string) {
    return this.authService.logout(token);
  }
}