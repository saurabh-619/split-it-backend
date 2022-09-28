import { CoreOutput } from './../../common/dtos/output.dto';
import { FriendRequest } from './../entities/friend-request.entity';

export class GetFriendRequestBetweenTwoOutput extends CoreOutput {
  request?: FriendRequest;
}
