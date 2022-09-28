import { User } from './../../user/entities/User.entity';
import { MoneyRequestStatus } from './../../common/types';
import { CoreEntity } from './../../common/enitites/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity('money_request')
export class MoneyRequest extends CoreEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({
    enumName: 'money_request_status',
    enum: MoneyRequestStatus,
    default: MoneyRequestStatus.PENDING,
  })
  status: MoneyRequestStatus;

  @Column({ type: 'text', nullable: true })
  requesteeRemark?: string;

  @ManyToOne(() => User)
  requester: User;

  @ManyToOne(() => User)
  requestee: User;

  @RelationId((moneyRequest: MoneyRequest) => moneyRequest.requester)
  requesterId: number;

  @RelationId((moneyRequest: MoneyRequest) => moneyRequest.requestee)
  requesteeId: number;
}
