import { CoreEntity } from '@common/enitites/Core.entity';
import { MoneyRequestStatus } from '@common/types';
import { User } from '@user/enitities/user.entity';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity('money_request')
export class MoneyRequest extends CoreEntity {
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  description: string;

  @Column({ type: 'double' })
  @IsNumber()
  amount: number;

  @Column({
    enumName: 'money_request_status',
    enum: MoneyRequestStatus,
    default: MoneyRequestStatus.PENDING,
  })
  @IsEnum(MoneyRequestStatus)
  status: MoneyRequestStatus;

  @ManyToOne(() => User)
  requester: User;

  @ManyToOne(() => User)
  requestee: User;

  @RelationId((moneyRequest: MoneyRequest) => moneyRequest.requester)
  requesterId: number;

  @RelationId((moneyRequest: MoneyRequest) => moneyRequest.requestee)
  requesteeId: number;
}
