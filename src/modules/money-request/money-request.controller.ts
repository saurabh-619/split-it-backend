import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { AuthUser } from '../auth/auth.user.decorator';
import { User } from './../user/entities/User.entity';
import {
  GetMoneyRequestsOutput,
  GetMoneyRequestsQuery,
} from './dtos/get-money-requests.dto';
import {
  SendMoneyRequestDto,
  SendMoneyRequestOutput,
} from './dtos/send-money-request.dto';
import {
  UpdateMoneyRequestDto,
  UpdateMoneyRequestOutput,
} from './dtos/update-money-request.dto';
import { MoneyRequestService } from './money-request.service';

@Controller('money-request')
export class MoneyRequestController {
  constructor(private readonly moneyRequestService: MoneyRequestService) {}

  @Get('/to-me')
  getMoneyRequests(
    @AuthUser() user: User,
    @Query() getMoneyRequestsQuery: GetMoneyRequestsQuery,
  ): Promise<GetMoneyRequestsOutput> {
    return this.moneyRequestService.getMoneyRequests(
      user,
      getMoneyRequestsQuery,
    );
  }

  @Get('/by-me')
  getMoneyRequestsMade(
    @AuthUser() user: User,
    @Query() getMoneyRequestsQuery: GetMoneyRequestsQuery,
  ): Promise<GetMoneyRequestsOutput> {
    return this.moneyRequestService.getMoneyRequestsMade(
      user,
      getMoneyRequestsQuery,
    );
  }

  @Post()
  sendMoneyRequest(
    @AuthUser() user: User,
    @Body() sendMoneyRequestDto: SendMoneyRequestDto,
  ): Promise<SendMoneyRequestOutput> {
    return this.moneyRequestService.sendMoneyRequest(user, sendMoneyRequestDto);
  }

  @Patch()
  updateMoneyRequest(
    @AuthUser() user: User,
    @Body() updateMoneyRequestDto: UpdateMoneyRequestDto,
  ): Promise<UpdateMoneyRequestOutput> {
    return this.moneyRequestService.updateMoneyRequest(
      user,
      updateMoneyRequestDto,
    );
  }
}
