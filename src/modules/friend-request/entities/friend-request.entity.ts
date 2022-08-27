import { CoreEntity } from '@common';
import { FriendRequestStatus } from '@common';
import { MoneyRequest } from '@money-request';
import { User } from '@user';
import { IsEnum } from 'class-validator';
import { Column, ManyToOne, RelationId } from 'typeorm';

export class FriendRequest extends CoreEntity {
  @Column({
    enumName: 'friend_request_status',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;

  @ManyToOne(() => User)
  requester: User;

  @ManyToOne(() => User)
  requestee: User;

  @RelationId((moneyRequest: MoneyRequest) => moneyRequest.requester)
  requesterId: number;

  @RelationId((moneyRequest: MoneyRequest) => moneyRequest.requestee)
  requesteeId: number;
}
