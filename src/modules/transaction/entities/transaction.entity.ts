import { CoreEntity, TransactionType } from '@common';
import { MoneyRequest } from '@money-request';
import { User } from '@user';
import { Bill } from 'src/modules/bill/entities/bill.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  RelationId,
} from 'typeorm';

@Entity('transaction')
export class Transaction extends CoreEntity {
  @Column({ type: 'double precision', default: 0 })
  amount: number;

  @Column({
    enumName: 'transaction_type',
    enum: TransactionType,
    default: TransactionType.SPLIT,
  })
  type: TransactionType;

  @ManyToOne(() => Bill, { nullable: true, onDelete: 'CASCADE' })
  bill?: Bill;

  @OneToOne(() => MoneyRequest, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  moneyRequest?: MoneyRequest;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  from: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  to: User;

  @Column({ default: false })
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
