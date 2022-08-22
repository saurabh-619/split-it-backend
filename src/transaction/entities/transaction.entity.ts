import { User } from '@user/enitities/user.entity';
import { MoneyRequest } from '@money-request/entities/money-request.entity';
import { Bill } from '@bill/entities/bill.entity';
import { CoreEntity } from '@common/enitites/Core.entity';
import { TransactionType } from '@common/types';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Column, ManyToOne, OneToOne, RelationId } from 'typeorm';

export class Transaction extends CoreEntity {
  @Column({ type: 'double', default: 0 })
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
