import { User } from './../entities/User.entity';
import { CoreOutput } from './../../common/dtos/output.dto';

import { IsNotEmpty } from 'class-validator';

export class SearchQueryDto {
  @IsNotEmpty({ message: 'query is required' })
  query: string;
}

export class SearchUserOuput extends CoreOutput {
  size?: number;
  results?: User[];
}
