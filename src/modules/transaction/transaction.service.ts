import { InsertResult, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
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
}
