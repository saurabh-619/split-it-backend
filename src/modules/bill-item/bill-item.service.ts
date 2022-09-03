import { UserService } from '@user';
import { BillService } from '@bill';
import { ItemService } from '@item';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveBillItemDto, SaveBillItemOutput } from './dtos/save-bill-item.dto';
import { BillItem } from './entities/bill-item.entity';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class BillItemService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(BillItem)
    private readonly billItemRepo: Repository<BillItem>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => BillService))
    private readonly billService: BillService,
    private readonly itemService: ItemService,
  ) {}

  async saveBillItem({
    billId,
    name,
    description,
    image,
    price,
    friendIds,
    quantity,
  }: SaveBillItemDto): Promise<SaveBillItemOutput> {
    try {
      const bill = await this.billService.getById(billId);

      if (bill === null) {
        return {
          ok: false,
          status: 500,
          error: "couldn't find the bill",
        };
      }

      const item = await this.itemService.save({
        name,
        description,
        image,
        price,
      });

      if (item === null) {
        return {
          ok: false,
          status: 500,
          error: "couldn't add an item",
        };
      }

      const friends = await this.userService.getUsersByIds(friendIds);

      if (friends.length === 0) {
        return {
          ok: false,
          status: 400,
          error: 'one of the friends do not exist on the app anymore',
        };
      }

      const billItem: BillItem = await this.billItemRepo.save({
        bill,
        item,
        friends,
        quantity,
        total: quantity * price,
      });

      // change total of the bill
      bill.total += quantity * price;

      if (bill.billItems?.length !== 0) {
        bill.billItems = [...bill.billItems, billItem];
      } else {
        bill.billItems = [billItem];
      }

      const billResult = await this.billService.save(bill);

      return {
        ok: false,
        status: 201,
        billId: billResult.id,
        billItemId: billItem.id,
      };
    } catch (e) {
      console.log({ e });
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't add a bill item",
      };
    }
  }
}
