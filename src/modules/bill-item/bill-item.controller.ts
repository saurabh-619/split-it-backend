import { Body, Controller, Get, Post } from '@nestjs/common';
import { BillItemService } from './bill-item.service';
import { SaveBillItemDto, SaveBillItemOutput } from './dtos/save-bill-item.dto';

@Controller('bill-item')
export class BillItemController {
  constructor(private readonly billItemService: BillItemService) {}

  @Get()
  getHello(): string {
    return 'hello';
  }

  @Post()
  saveBillItem(
    @Body() billItemInput: SaveBillItemDto,
  ): Promise<SaveBillItemOutput> {
    return this.billItemService.saveBillItem(billItemInput);
  }
}
