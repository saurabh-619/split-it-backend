import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserDto, UpdateUserOutput } from './dtos/update-user.dto';
import {
  CheckIfUsernameAvailableOutput,
  UsernameQueryDto,
} from './dtos/check-if-username-taken.dto';
import { SearchQueryDto } from './dtos/search-user.dto';
import { AuthUser } from '../auth/auth.user.decorator';

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

  @Get('/:id')
  getUser(
    @AuthUser('id') userId1: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CheckIfUsernameAvailableOutput> {
    return this.userService.getUser(userId1, id);
  }

  @Patch('/')
  update(
    @AuthUser() user: User,
    @Body() updates: UpdateUserDto,
  ): Promise<UpdateUserOutput> {
    return this.userService.update(user, updates);
  }
}
