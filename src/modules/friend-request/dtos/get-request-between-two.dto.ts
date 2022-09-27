import { FriendRequest } from './../entities/friend-request.entity';
import { CoreOutput } from '@common';

export class GetFriendRequestBetweenTwoOutput extends CoreOutput {
  request?: FriendRequest;
}
