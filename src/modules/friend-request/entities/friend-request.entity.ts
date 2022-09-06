import { CoreEntity } from '@common';
import { FriendRequestStatus } from '@common';
import { MoneyRequest } from '@money-request';
import { User } from '@user';
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
