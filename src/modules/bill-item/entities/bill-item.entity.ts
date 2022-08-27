import { CoreEntity } from '@common';
import { Item } from '@item';
import { IsNumber } from 'class-validator';
import { Bill } from 'src/modules/bill/entities/bill.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity('bill_item')
export class BillItem extends CoreEntity {
  @ManyToOne(() => Item)
  item: Item;

  @ManyToOne(() => Bill)
  bill: Bill;

  @Column({ default: 1 })
  @IsNumber()
  quantity: number;

  @Column({ type: 'double precision' })
  @IsNumber()
  total: number;

  @RelationId((billItem: BillItem) => billItem.bill)
  billId: number;
}
