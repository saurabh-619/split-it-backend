import { IsEnum, IsOptional } from 'class-validator';
import { Transaction } from './../entities/transaction.entity';
import {
  PaginationOuput,
  PaginationQueryDto,
  TransactionStatus,
  TransactionType,
} from '@common';

export class GetTransactionDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(TransactionType, { message: 'not valid type' })
  type?: TransactionType;

  @IsOptional()
  @IsEnum(TransactionStatus, { message: 'not valid transaction status' })
  state?: TransactionStatus;
}

export class GetTransactionsOutput extends PaginationOuput {
  transactions?: Transaction[];
}
