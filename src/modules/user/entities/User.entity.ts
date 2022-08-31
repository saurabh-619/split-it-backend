import { CoreEntity } from '@common';
import { Wallet } from '@wallet';
import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';

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

  @OneToOne(() => Wallet)
  @JoinColumn()
  wallet: Wallet;

  @RelationId((user: User) => user.wallet)
  walletId: number;
}
