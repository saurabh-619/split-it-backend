import { User } from './../../user/entities/User.entity';
import { CoreEntity } from './../../common/enitites/core.entity';
import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';

@Entity('wallet')
export class Wallet extends CoreEntity {
  @Column({ type: 'double precision', default: 5000 })
  balance: number;

  @OneToOne(() => User, (user: User) => user.wallet, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  owner?: User;

  @RelationId((self: Wallet) => self.owner)
  ownerId?: number;
}
