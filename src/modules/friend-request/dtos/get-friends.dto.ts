import { CoreOutput } from '@common';
import { User } from '@user';

export class GetFriendsOutput extends CoreOutput {
  count?: number;
  friends?: User[];
}
