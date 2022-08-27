import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, LoginOutput } from './dtos/login.dto';
import { RegisterDto, RegisterOutput } from './dtos/register.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<LoginOutput> {
    return this.userService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registerDto: RegisterDto): Promise<RegisterOutput> {
    return this.userService.register(registerDto);
  }
}
