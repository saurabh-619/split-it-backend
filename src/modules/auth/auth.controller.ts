import { AuthUser } from './auth.user.decorator';
import { User } from './../user/entities/User.entity';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginOutput } from './dtos/login.dto';
import { RegisterDto, RegisterOutput } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  me(@AuthUser() user: User): User {
    return user;
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<LoginOutput> {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registerDto: RegisterDto): Promise<RegisterOutput> {
    return this.authService.register(registerDto);
  }
}
