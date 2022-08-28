import { CoreOutput } from '@common';
import { FriendRequest } from '../entities/friend-request.entity';

export class GetPendingRequestsOuput extends CoreOutput {
  count?: number;
  friendRequests?: FriendRequest[];
}
