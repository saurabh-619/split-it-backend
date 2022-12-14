import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository, UpdateResult } from 'typeorm';
import { PaginationQueryDto } from './../common/dtos/pagination.dto';
import { TransactionService } from './../transaction/transaction.service';
import { User } from './../user/entities/User.entity';
import { UserService } from './../user/user.service';
import { WalletService } from './../wallet/wallet.service';
import { AddFriendsDto } from './dtos/add-friends.dto';
import { GenerateBillDto, GenerateBillOutput } from './dtos/generate-bill.dto';
import {
  BillOuput,
  FriendsWithPaymentInfo,
  GetBillsOuput,
} from './dtos/get-bills.dto';
import { GetEntireByIdOutput } from './dtos/get-entire-by-id.dto';
import { InsertBillDto, InsertBillOuput } from './dtos/insert-bill.dto';
import { Bill } from './entities/bill.entity';

import { TransactionType } from '../common/types';
import {
  PayTheSplitDto,
  PayTheSplitOutput,
} from './interfaces/pay-the-split.dto';

@Injectable()
export class BillService {
  private readonly logger: Logger;
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
    @InjectRepository(Bill) private readonly billRepo: Repository<Bill>,
  ) {
    this.logger = new Logger(BillService.name);
  }

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
        relations: ['leader', 'friends', 'billItems.friends', 'billItems.item'],
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

  async getBillsWhereLeader(
    user: User,
    { page = 1, limit }: PaginationQueryDto,
  ): Promise<GetBillsOuput> {
    try {
      const skip = (page - 1) * limit || 0;

      const bills = (await this.billRepo.find({
        where: {
          leader: { id: user.id },
        },
        relations: ['leader', 'friends', 'billItems.friends', 'billItems.item'],
        skip,
        take: limit,
        order: {
          createdAt: 'desc',
        },
      })) as BillOuput[];

      for (const bill of bills) {
        const transactionsOnBill = await this.transactionService.getAllByBillId(
          bill.id,
        );

        bill.leader = <FriendsWithPaymentInfo>{
          ...bill.leader,
          paymentInfo: {
            amount:
              transactionsOnBill.find(
                (x) =>
                  x.type === TransactionType.BILL &&
                  x.from.id === bill.leader.id,
              )?.amount ?? 0,
            hasPaid: true,
          },
        };

        bill.friends = bill.friends.map((friend) => {
          const transaction = transactionsOnBill.find(
            (x) => x.type !== TransactionType.BILL && x.from.id === friend.id,
          );

          return <FriendsWithPaymentInfo>{
            ...friend,
            paymentInfo: {
              hasPaid: transaction.isComplete,
              amount: transaction.amount,
            },
          };
        }) as FriendsWithPaymentInfo[];
      }

      return {
        ok: true,
        status: 200,
        size: bills.length ?? 0,
        hasLeft: bills.length === limit,
        bills,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't fetch the bills",
      };
    }
  }

  async getBillsWhereSplit(
    user: User,
    { page = 1, limit }: PaginationQueryDto,
  ): Promise<GetBillsOuput> {
    try {
      const skip = (page - 1) * limit || 0;

      const billDocs = await this.billRepo.find({
        where: {
          leader: {
            id: Not(user.id),
          },
          friends: { id: user.id },
        },
        skip,
        take: limit,
        order: {
          createdAt: 'desc',
        },
      });

      const billIds = billDocs.map((x) => x.id);

      const bills = (await this.billRepo.find({
        where: {
          id: In(billIds),
        },
        relations: ['leader', 'friends', 'billItems.friends', 'billItems.item'],
      })) as BillOuput[];

      for (const bill of bills) {
        const transactionsOnBill = await this.transactionService.getAllByBillId(
          bill.id,
        );

        bill.leader = <FriendsWithPaymentInfo>{
          ...bill.leader,
          paymentInfo: {
            amount:
              transactionsOnBill.find(
                (x) =>
                  x.type === TransactionType.BILL &&
                  x.from.id === bill.leader.id,
              )?.amount || 0,
            hasPaid: true,
          },
        };

        bill.friends = bill.friends.map((friend) => {
          const transaction = transactionsOnBill.find(
            (x) => x.type !== TransactionType.BILL && x.from.id === friend.id,
          );

          return <FriendsWithPaymentInfo>{
            ...friend,
            paymentInfo: {
              hasPaid: transaction.isComplete,
              amount: transaction.amount,
            },
          };
        }) as FriendsWithPaymentInfo[];
      }

      return {
        ok: true,
        status: 200,
        size: bills.length ?? 0,
        hasLeft: bills.length === limit,
        bills,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't fetch the bills",
      };
    }
  }

  async insertBill(
    user: User,
    { title, description, image }: InsertBillDto,
  ): Promise<InsertBillOuput> {
    try {
      const billInstance = this.billRepo.create({
        title: title,
        description: description,
        leader: user,
        image: image ?? null,
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

  async generateBill(
    user: User,
    { billId, tax, isPaid, splits, isEqualSplit }: GenerateBillDto,
  ): Promise<GenerateBillOutput> {
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

      bill.tax = tax ?? bill.tax;
      bill.isPaid = isPaid ?? bill.isPaid;
      bill.total += tax ?? 0;

      // calculate the split if isEqualSplit
      const split = Math.round(bill.total / splits.length);

      if (isPaid) {
        bill.fractionPaid = '1.0';
        bill.paidAmount = bill.total;
      } else {
        // only leader has paid the money
        const leaderSplit = splits.find(
          (split) => split.friendId === bill.leader.id,
        );
        if (leaderSplit !== undefined && leaderSplit.split) {
          bill.paidAmount = leaderSplit.split;
          bill.fractionPaid =
            bill.paidAmount / bill.total < 1
              ? (bill.paidAmount / bill.total).toFixed(4)
              : '1.0';
        }
      }

      // create transaction for leader
      await this.transactionService.insert({
        amount: bill.total,
        bill,
        isComplete: true,
        type: TransactionType.BILL,
        from: user,
        to: null,
      });

      // create transactions for splits
      for (const splitIns of splits) {
        const splitUser = await this.userService.getUserById(splitIns.friendId);
        const isComplete = isPaid ? isPaid : splitUser.id === bill.leader.id;

        await this.transactionService.insert({
          amount: isEqualSplit === true ? split : splitIns.split,
          bill,
          isComplete,
          to: bill.leader,
          from: splitUser,
        });
      }

      const savedBill = await this.save(bill);
      if (savedBill === null) {
        return {
          ok: false,
          status: 400,
          error: "couldn't update the bill",
        };
      }

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

  async payTheSplit(
    user: User,
    { billId, transactionId }: PayTheSplitDto,
  ): Promise<PayTheSplitOutput> {
    try {
      const bill = await this.getById(billId);

      if (bill === null) {
        return {
          ok: false,
          status: 400,
          error: "bill doesn't exists anymore",
        };
      }

      const transaction = await this.transactionService.getByIdWithRelations(
        transactionId,
      );

      if (transaction === null) {
        return {
          ok: false,
          status: 400,
          error: "transaction doesn't exists anymore",
        };
      }

      if (transaction.from.id !== user.id) {
        return {
          ok: false,
          status: 400,
          error: "current user can't complete the transaction",
        };
      }

      // transfet money
      const { ok, error: transferError } =
        await this.walletService.transferMoney(
          user,
          transaction.from.id,
          transaction.to.id,
          transaction.amount,
        );

      if (!ok) {
        return { ok, status: 500, error: transferError };
      }

      transaction.isComplete = true;

      await this.transactionService.save(transaction);

      bill.paidAmount += transaction.amount;
      bill.fractionPaid = (bill.paidAmount / bill.total).toFixed(4);

      if (bill.paidAmount === bill.total) {
        bill.isPaid = true;
      }

      await this.save(bill);

      return {
        ok: true,
        status: 201,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't pay the split",
      };
    }
  }
}
