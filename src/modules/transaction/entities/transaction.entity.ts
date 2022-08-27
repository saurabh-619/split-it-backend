import { User } from '@user';
import { MoneyRequest } from '@money-request';
import { Bill } from 'src/modules/bill/entities/bill.entity';
import { CoreEntity } from '@common';
import { TransactionType } from '@common';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Column, ManyToOne, OneToOne, RelationId } from 'typeorm';

export class Transaction extends CoreEntity {
  @Column({ type: 'double precision', default: 0 })
  @IsNumber()
  amount: number;

  @Column({
    enumName: 'transaction_type',
    enum: TransactionType,
    default: TransactionType.SPLIT,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ManyToOne(() => Bill, { nullable: true })
  bill?: Bill;

  @OneToOne(() => MoneyRequest, { nullable: true })
  moneyRequest?: MoneyRequest;

  @ManyToOne(() => User)
  from: User;

  @ManyToOne(() => User)
  to: User;

  @Column({ default: false })
  @IsBoolean()
  isComplete: boolean;

  @RelationId((transaction: Transaction) => transaction.bill)
  billId: number;

  @RelationId((transaction: Transaction) => transaction.moneyRequest)
  moneyRequestId: number;

  @RelationId((transaction: Transaction) => transaction.from)
  fromId: number;

  @RelationId((transaction: Transaction) => transaction.to)
  toId: number;
}
