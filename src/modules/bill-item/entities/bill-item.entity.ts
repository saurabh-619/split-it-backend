import { CoreEntity } from '@common';
import { Item } from '@item';
import { User } from '@user';
import { Bill } from 'src/modules/bill/entities/bill.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity('bill_item')
export class BillItem extends CoreEntity {
  @ManyToOne(() => Item, { onDelete: 'SET NULL' })
  item: Item;

  @ManyToOne(() => Bill, (bill: Bill) => bill.billItems, {
    onDelete: 'CASCADE',
  })
  bill: Bill;

  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  friends?: User[];

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'double precision' })
  total: number;

  @RelationId((billItem: BillItem) => billItem.bill)
  billId: number;
}
