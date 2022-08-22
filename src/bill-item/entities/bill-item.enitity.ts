import { CoreEntity } from '@common/enitites/Core.entity';
import { Item } from '@item/entities/item.entity';
import { IsNumber } from 'class-validator';
import { Bill } from 'src/bill/entities/bill.entity';
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

  @Column({ type: 'double' })
  @IsNumber()
  total: number;

  @RelationId((billItem: BillItem) => billItem.bill)
  billId: number;
}
