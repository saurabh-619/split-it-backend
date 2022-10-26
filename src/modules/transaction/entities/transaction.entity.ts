import { User } from './../../user/entities/User.entity';
import { MoneyRequest } from './../../money-request/entities/money-request.entity';
import { Bill } from './../../bill/entities/bill.entity';
import { TransactionType } from './../../common/types';
import { CoreEntity } from './../../common/enitites/core.entity';
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

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  to?: User;

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
