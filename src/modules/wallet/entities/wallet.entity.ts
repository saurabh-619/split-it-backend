import { Entity, OneToOne, JoinTable, Column } from 'typeorm';
import { CoreEntity } from '@common';
import { User } from '@user';
import { IsNumber } from 'class-validator';

@Entity('wallet')
export class Wallet extends CoreEntity {
  @OneToOne(() => User)
  @JoinTable()
  user: User;

  @Column({ default: 5000 })
  @IsNumber()
  balance: number;
}
