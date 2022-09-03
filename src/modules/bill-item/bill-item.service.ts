import { UserService } from '@user';
import { BillService } from '@bill';
import { ItemService } from '@item';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AddBillItemDto, AddBillItemOutput } from './dtos/add-bill-item.dto';
import { BillItem } from './entities/bill-item.entity';
import { PinoLogger } from 'nestjs-pino';
import {
  RemoveBillItemDto,
  RemoveBillItemOutput,
} from './dtos/remove-bill-item.dto';

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

  async getById(id: number): Promise<BillItem> {
    return this.billItemRepo.findOne({
      where: {
        id,
      },
      relations: ['item'],
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.billItemRepo.delete(id);
  }

  async addBillItem({
    billId,
    name,
    description,
    image,
    price,
    friendIds,
    quantity,
  }: AddBillItemDto): Promise<AddBillItemOutput> {
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
      bill.totalWithoutTax += quantity * price;

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

  async removeBillItem({
    billId,
    billItemId,
  }: RemoveBillItemDto): Promise<RemoveBillItemOutput> {
    try {
      const bill = await this.billService.getById(billId);

      if (bill === null) {
        return {
          ok: false,
          status: 500,
          error: "couldn't find the bill",
        };
      }

      const billItem = await this.getById(billItemId);

      if (billItem === null) {
        return {
          ok: false,
          status: 400,
          error: "bill item doesn't exists anymore",
        };
      }

      if (bill.billItems) {
        bill.billItems = bill.billItems.filter((x) => x.id !== billItemId);
      }

      // change total of the bill
      bill.total -= billItem.quantity * billItem.item.price;
      bill.totalWithoutTax -= billItem.quantity * billItem.item.price;

      const billResult = await this.billService.save(bill);

      const deleteResult = await this.delete(billItemId);

      if (deleteResult.affected === 0) {
        return {
          ok: false,
          status: 400,
          error: "bill item couldn't be deleted",
        };
      }

      return {
        ok: false,
        status: 201,
        billId: billResult.id,
      };
    } catch (e) {
      console.log({ e });
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't remove a bill item",
      };
    }
  }
}
