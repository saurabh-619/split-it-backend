import { CoreOutput } from './../../common/dtos/output.dto';
import { FriendRequest } from '../entities/friend-request.entity';

export class GetPendingRequestsOuput extends CoreOutput {
  count?: number;
  friendRequests?: FriendRequest[];
}
