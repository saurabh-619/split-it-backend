import { CoreEntity } from '@common';
import { User } from '@user';
import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { BillItem } from '@bill-item';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity('bill')
export class Bill extends CoreEntity {
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  description: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @OneToMany(() => BillItem, (billItem) => billItem.bill)
  billItems: BillItem[];

  @Column({ type: 'double precision', default: 0 })
  @IsNumber()
  total: number;

  @Column({ type: 'double precision', default: 0 })
  @IsNumber()
  tax: number;

  @Column({ type: 'double precision', default: 0 })
  @IsNumber()
  paidAmount: number;

  @Column({ type: 'double precision', default: 0.0 })
  @IsNumber()
  fractionPaid: number;

  @Column({ default: false })
  @IsBoolean()
  isPaid: boolean;

  @Column()
  @IsString()
  image: string;
}
