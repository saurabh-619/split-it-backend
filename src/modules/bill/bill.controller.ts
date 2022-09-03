import { User } from '@user';
import { AuthUser } from '@auth-user';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { InsertBillDto, InsertBillOuput } from './dtos/insert-bill.dto';
import { AddFriendsDto } from './dtos/add-friends.dto';
import { GetEntireByIdOutput } from './dtos/get-entire-by-id.dto';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

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
}
