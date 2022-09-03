import { CoreEntity } from '@common';
import { User } from '@user';
import { BillItem } from '@bill-item';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('bill')
export class Bill extends CoreEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User, (user: User) => user.leaderBills, {
    onDelete: 'SET NULL',
  })
  leader: User;

  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  friends?: User[];

  @OneToMany(() => BillItem, (billItem) => billItem.bill, { nullable: true })
  billItems?: BillItem[];

  @Column({ type: 'double precision', default: 0 })
  total: number;

  @Column({ type: 'double precision', default: 0 })
  tax: number;

  @Column({ type: 'double precision', default: 0 })
  paidAmount: number;

  @Column({ type: 'double precision', default: 0.0 })
  fractionPaid: number;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true })
  image?: string;
}
