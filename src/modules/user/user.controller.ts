import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';

import { AuthUser } from '@auth-user';
import { User } from './entities/user.entity';
import { UpdateUserDto, UpdateUserOutput } from './dtos/update-user.dto';
import {
  CheckIfUsernameAvailableOutput,
  CheckIfUsernameAvailableQueryDto,
} from './dtos/check-if-username-taken.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  me(@AuthUser() user: User): User {
    return user;
  }

  @Get('/is-available')
  checkIfUsernameAvailable(
    @Query() query: CheckIfUsernameAvailableQueryDto,
  ): Promise<CheckIfUsernameAvailableOutput> {
    return this.userService.checkIfUsernameAvailable(query.username);
  }

  @Patch('/')
  update(
    @AuthUser() user: User,
    @Body() updates: UpdateUserDto,
  ): Promise<UpdateUserOutput> {
    return this.userService.update(user, updates);
  }
}
