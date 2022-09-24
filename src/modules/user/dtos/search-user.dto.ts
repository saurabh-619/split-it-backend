import { User } from '@user';
import { CoreOutput } from '@common';
import { IsNotEmpty } from 'class-validator';

export class SearchQueryDto {
  @IsNotEmpty({ message: 'query is required' })
  query: string;
}

export class SearchUserOuput extends CoreOutput {
  size?: number;
  results?: User[];
}
