import { CoreEntity } from '@common/enitites/Core.entity';
import { Wallet } from '@wallet/entities/wallet.entity';
import { IsEmail, IsString } from 'class-validator';
import { Column, Entity, JoinTable, OneToOne, RelationId } from 'typeorm';

@Entity('user')
export class User extends CoreEntity {
  @Column()
  @IsString()
  username: string;

  @Column()
  @IsString()
  firstName: string;

  @Column()
  @IsString()
  lastName: string;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsEmail()
  avatar: string;

  @Column()
  @IsString()
  passwordHash: string;

  @Column()
  @IsString()
  salt: string;

  @OneToOne(() => Wallet)
  @JoinTable()
  wallet: Wallet;

  @RelationId((user: User) => user.wallet)
  walletId: number;
}
