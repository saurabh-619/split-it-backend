import { Bill } from '@bill';
import { CoreEntity } from '@common';
import { Wallet } from '@wallet';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  RelationId,
} from 'typeorm';

@Entity('user')
export class User extends CoreEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  avatar: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ select: false })
  salt: string;

  @OneToMany(() => Bill, (bill: Bill) => bill.leader)
  leaderBills: Bill[];

  @OneToOne(() => Wallet, (wallet) => wallet.owner)
  @JoinColumn()
  wallet: Wallet;

  @RelationId((user: User) => user.wallet)
  walletId: number;
}
