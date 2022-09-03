import { Entity, Column } from 'typeorm';
import { CoreEntity } from '@common';
import { IsNumber } from 'class-validator';

@Entity('wallet')
export class Wallet extends CoreEntity {
  @Column({ type: 'double precision', default: 5000 })
  @IsNumber()
  balance: number;
}
