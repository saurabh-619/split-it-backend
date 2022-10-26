import { User } from './../user/entities/User.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { TransactionStatus, TransactionType } from './../common/types';
import {
  GetTransactionDto,
  GetTransactionsOutput,
} from './dtos/get-transactions.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {
    this.logger = new Logger(TransactionService.name);
  }

  getById(id: number): Promise<Transaction> {
    return this.transactionRepo.findOne({
      where: { id },
    });
  }

  getByMoneyRequestId(id: number): Promise<Transaction> {
    return this.transactionRepo.findOne({
      where: {
        moneyRequest: {
          id,
        },
      },
    });
  }

  getByIdWithRelations(id: number): Promise<Transaction> {
    return this.transactionRepo.findOne({
      where: { id },
      relations: ['bill', 'moneyRequest', 'from', 'to'],
    });
  }

  insert(transaction: Partial<Transaction>): Promise<InsertResult> {
    return this.transactionRepo.insert(transaction);
  }

  save(transaction: Partial<Transaction>): Promise<Transaction> {
    return this.transactionRepo.save(transaction);
  }

  async getTransactions(
    user: User,
    {
      type = TransactionType.SPLIT,
      state = TransactionStatus.PENDING,
      page = 1,
      limit,
    }: GetTransactionDto,
  ): Promise<GetTransactionsOutput> {
    const skip = (page - 1) * limit || 0;

    try {
      const transactions = await this.transactionRepo
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.from', 'from')
        .leftJoinAndSelect('transaction.to', 'to')
        .leftJoinAndSelect('transaction.bill', 'bill')
        .leftJoinAndSelect('transaction.moneyRequest', 'moneyRequest')
        .where('from.id = :id', { id: user.id })
        .andWhere('transaction.type = :type', { type })
        .andWhere('transaction.isComplete = :isComplete', {
          isComplete: state === TransactionStatus.PAID,
        })
        .andWhere('from.id != to.id')
        .orWhere('to.id = :id', { id: user.id })
        .andWhere('type = :type', { type })
        .andWhere('from.id != to.id')
        .andWhere('transaction.isComplete = :isComplete', {
          isComplete: state === TransactionStatus.PAID,
        })
        .skip(skip)
        .take(limit)
        .orderBy('transaction.createdAt', 'DESC')
        .getMany();

      return {
        ok: true,
        status: 200,
        size: transactions.length,
        hasLeft: transactions.length === limit,
        transactions,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't fetch the transactions",
      };
    }
  }
}
