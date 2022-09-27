import { MoneyRequest } from '@money-request';
import { User } from '@user';
import { CoreOutput, FriendRequestStatus } from '@common';

export class GetUserOutput extends CoreOutput {
  isFriend?: boolean;
  friendshipStatus?: FriendRequestStatus;
  user?: User;
  moneyRequests?: MoneyRequest[];
}
