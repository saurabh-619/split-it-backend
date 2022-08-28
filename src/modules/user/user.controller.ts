import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

import { AuthUser } from '@auth-user';
import { User } from './entities/user.entity';
import { UpdateUserDto, UpdateUserOutput } from './dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  me(@AuthUser() user: User): User {
    return user;
  }

  @Patch('/')
  update(
    @AuthUser() user: User,
    @Body() updates: UpdateUserDto,
  ): Promise<UpdateUserOutput> {
    return this.userService.update(user, updates);
  }
}
