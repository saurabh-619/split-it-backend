import { MoneyRequest } from './../../money-request/entities/money-request.entity';
import { User } from './../entities/User.entity';
import { FriendRequestStatus } from './../../common/types';
import { CoreOutput } from './../../common/dtos/output.dto';

export class GetUserOutput extends CoreOutput {
  friendRequestId?: number;
  isFriend?: boolean;
  friendshipStatus?: FriendRequestStatus;
  user?: User;
  moneyRequests?: MoneyRequest[];
}
