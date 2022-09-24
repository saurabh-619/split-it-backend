import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';

import { AuthUser } from '@auth-user';
import { User } from './entities/user.entity';
import { UpdateUserDto, UpdateUserOutput } from './dtos/update-user.dto';
import {
  CheckIfUsernameAvailableOutput,
  UsernameQueryDto,
} from './dtos/check-if-username-taken.dto';
import { SearchQueryDto } from './dtos/search-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  me(@AuthUser() user: User): User {
    return user;
  }

  @Get('/is-available')
  checkIfUsernameAvailable(
    @Query() query: UsernameQueryDto,
  ): Promise<CheckIfUsernameAvailableOutput> {
    return this.userService.checkIfUsernameAvailable(query.username);
  }

  @Get('/search')
  searchUser(
    @Query() query: SearchQueryDto,
  ): Promise<CheckIfUsernameAvailableOutput> {
    return this.userService.searchUser(query.query);
  }

  @Patch('/')
  update(
    @AuthUser() user: User,
    @Body() updates: UpdateUserDto,
  ): Promise<UpdateUserOutput> {
    return this.userService.update(user, updates);
  }
}
