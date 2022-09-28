import { User } from './../../user/entities/User.entity';
import { Bill } from './../../bill/entities/bill.entity';
import { CoreEntity } from './../../common/enitites/core.entity';
import { Item } from './../../item/entities/item.entity';
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
