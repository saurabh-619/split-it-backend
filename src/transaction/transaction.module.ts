import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@transaction/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
})
export class TransactionModule {}
