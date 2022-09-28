import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from './../common/dtos/pagination.dto';
import { User } from './../user/entities/User.entity';
import { AuthUser } from '../auth/auth.user.decorator';
import { BillService } from './bill.service';
import { AddFriendsDto } from './dtos/add-friends.dto';
import { GenerateBillDto, GenerateBillOutput } from './dtos/generate-bill.dto';
import { GetBillsOuput } from './dtos/get-bills.dto';
import { GetEntireByIdOutput } from './dtos/get-entire-by-id.dto';
import { InsertBillDto, InsertBillOuput } from './dtos/insert-bill.dto';
import { PayTheSplitDto } from './interfaces/pay-the-split.dto';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Get('/')
  getBillsWhereLeader(
    @AuthUser() user: User,
    @Query() paginationParams: PaginationQueryDto,
  ): Promise<GetBillsOuput> {
    return this.billService.getBillsWhereLeader(user, paginationParams);
  }

  @Get('/split')
  getBillsWhereSplit(
    @AuthUser() user: User,
    @Query() paginationParams: PaginationQueryDto,
  ): Promise<GetBillsOuput> {
    return this.billService.getBillsWhereSplit(user, paginationParams);
  }

  @Get('/:id')
  getEntireBill(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetEntireByIdOutput> {
    return this.billService.getEntireById(id);
  }

  @Post()
  insertBill(
    @AuthUser() user: User,
    @Body() insertBillDto: InsertBillDto,
  ): Promise<InsertBillOuput> {
    return this.billService.insertBill(user, insertBillDto);
  }

  @Patch()
  addFriends(
    @AuthUser() user: User,
    @Body() addFriendsDto: AddFriendsDto,
  ): Promise<InsertBillOuput> {
    return this.billService.addFriends(user, addFriendsDto);
  }

  @Patch('/generate')
  generateBill(
    @AuthUser() user: User,
    @Body() generateFriendsDto: GenerateBillDto,
  ): Promise<GenerateBillOutput> {
    return this.billService.generateBill(user, generateFriendsDto);
  }

  @Patch('/pay-the-split')
  payTheSplit(
    @AuthUser() user: User,
    @Body() payTheSplitDto: PayTheSplitDto,
  ): Promise<GenerateBillOutput> {
    return this.billService.payTheSplit(user, payTheSplitDto);
  }
}
