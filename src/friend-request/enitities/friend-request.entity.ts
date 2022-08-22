import { CoreEntity } from '@common/enitites/Core.entity';
import { FriendRequestStatus } from '@common/types';
import { MoneyRequest } from '@money-request/entities/money-request.entity';
import { User } from '@user/enitities/user.entity';
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
