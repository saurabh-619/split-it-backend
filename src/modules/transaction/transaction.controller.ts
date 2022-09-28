import { User } from './../user/entities/User.entity';
import { Controller, Get, Query } from '@nestjs/common';
import { GetTransactionDto } from './dtos/get-transactions.dto';
import { TransactionService } from './transaction.service';
import { AuthUser } from '../auth/auth.user.decorator';

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
