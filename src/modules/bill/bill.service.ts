import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserService } from '@user';
import { PinoLogger } from 'nestjs-pino';
import { Repository, UpdateResult } from 'typeorm';
import { AddFriendsDto } from './dtos/add-friends.dto';
import { GenerateBillDto, GenerateBillOutput } from './dtos/generate-bill.dto';
import { GetEntireByIdOutput } from './dtos/get-entire-by-id.dto';
import { InsertBillDto, InsertBillOuput } from './dtos/insert-bill.dto';
import { Bill } from './entities/bill.entity';

@Injectable()
export class BillService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Bill) private readonly billRepo: Repository<Bill>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getById(id: number): Promise<Bill> {
    return this.billRepo.findOne({
      where: {
        id,
      },
      relations: ['leader', 'billItems'],
    });
  }

  async getEntireById(id: number): Promise<GetEntireByIdOutput> {
    try {
      const bill = await this.billRepo.findOne({
        where: {
          id,
        },
        relations: ['leader', 'friends', 'billItems'],
      });

      return {
        ok: true,
        status: 200,
        bill,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't find the bill",
      };
    }
  }

  async update(bill: Partial<Bill>): Promise<UpdateResult> {
    return this.billRepo.update(bill.id, bill);
  }

  async save(bill: Partial<Bill>): Promise<Bill> {
    return this.billRepo.save(bill);
  }

  async insertBill(
    user: User,
    { title, description }: InsertBillDto,
  ): Promise<InsertBillOuput> {
    try {
      const billInstance = this.billRepo.create({
        title: title,
        description: description,
        leader: user,
      });

      const bill = await this.billRepo.save(billInstance);

      return {
        ok: true,
        status: 201,
        billId: bill.id,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't create new bill",
      };
    }
  }

  async addFriends(
    user: User,
    { billId, friendIds }: AddFriendsDto,
  ): Promise<InsertBillOuput> {
    try {
      const bill = await this.getById(billId);

      if (bill === null) {
        return {
          ok: false,
          status: 400,
          error: "bill doesn't exists. create a new one",
        };
      }

      if (bill.leader.id !== user.id) {
        return {
          ok: false,
          status: 400,
          error: 'user is not allowed to proceed the request',
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

      if (bill.friends !== undefined) {
        bill.friends.push(...friends);
      } else {
        bill.friends = friends;
      }

      const billResult = await this.billRepo.save(bill);

      return {
        ok: true,
        status: 201,
        billId: billResult.id,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't create new bill",
      };
    }
  }

  async generateBill({
    billId,
    billItemIds,
    tax,
    splits,
  }: GenerateBillDto): Promise<GenerateBillOutput> {
    try {
      console.log({ billId, billItemIds, tax, splits });
      return {
        ok: true,
        status: 201,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't generate the bill",
      };
    }
  }
}
