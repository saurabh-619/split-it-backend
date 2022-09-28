import { User } from './../../user/entities/User.entity';
import { CoreOutput } from './../../common/dtos/output.dto';

export class GetFriendsOutput extends CoreOutput {
  count?: number;
  friends?: User[];
}
