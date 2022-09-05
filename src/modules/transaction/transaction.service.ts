import { TransactionStatus, TransactionType } from '@common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user';
import { PinoLogger } from 'nestjs-pino';
import { InsertResult, Repository } from 'typeorm';
import {
  GetTransactionDto,
  GetTransactionsOutput,
} from './dtos/get-transactions.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  getById(id: number): Promise<Transaction> {
    return this.transactionRepo.findOne({
      where: { id },
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
