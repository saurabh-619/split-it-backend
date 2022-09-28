import { MoneyRequest } from './../../money-request/entities/money-request.entity';
import { User } from './../../user/entities/User.entity';
import { FriendRequestStatus } from './../../common/types';
import { CoreEntity } from './../../common/enitites/core.entity';
import { IsEnum } from 'class-validator';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity('friend_request')
export class FriendRequest extends CoreEntity {
  @Column({
    enumName: 'friend_request_status',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  @IsEnum(FriendRequestStatus, {
    message: 'invalid friend request update status',
  })
  status: FriendRequestStatus;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  requester: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  requestee: User;

  @RelationId((moneyRequest: MoneyRequest) => moneyRequest.requester)
  requesterId: number;

  @RelationId((moneyRequest: MoneyRequest) => moneyRequest.requestee)
  requesteeId: number;
}
