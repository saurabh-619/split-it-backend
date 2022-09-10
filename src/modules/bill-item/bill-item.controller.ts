import { Body, Controller, Patch } from '@nestjs/common';
import { BillItemService } from './bill-item.service';
import { AddBillItemDto, AddBillItemOutput } from './dtos/add-bill-item.dto';
import { RemoveBillItemDto } from './dtos/remove-bill-item.dto';

@Controller('bill-item')
export class BillItemController {
  constructor(private readonly billItemService: BillItemService) {}

  @Patch()
  addBillItem(
    @Body() addBillItemDto: AddBillItemDto,
  ): Promise<AddBillItemOutput> {
    return this.billItemService.addBillItem(addBillItemDto);
  }

  @Patch('/remove')
  removeBillItem(
    @Body() removeBillItemDto: RemoveBillItemDto,
  ): Promise<AddBillItemOutput> {
    return this.billItemService.removeBillItem(removeBillItemDto);
  }
}
