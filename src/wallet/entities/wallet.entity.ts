import { Entity, OneToOne, JoinTable, Column } from 'typeorm';
import { CoreEntity } from '@common/enitites/Core.entity';
import { User } from '@user/enitities/user.entity';
import { IsNumber } from 'class-validator';

Entity('wallet');
export class Wallet extends CoreEntity {
  @OneToOne(() => User)
  @JoinTable()
  user: User;

  @Column({ default: 5000 })
  @IsNumber()
  balance: number;
}
