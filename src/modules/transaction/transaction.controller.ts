import { AuthUser } from '@auth-user';
import { Controller, Get, Query } from '@nestjs/common';
import { User } from '@user';
import { GetTransactionDto } from './dtos/get-transactions.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Get()
  getTransactions(
    @AuthUser() user: User,
    @Query() getTransactionsParams: GetTransactionDto,
  ) {
    return this.transactionService.getTransactions(user, getTransactionsParams);
  }
}
