import { CoreOutput } from '@common';
import { IsNotEmpty } from 'class-validator';

export class CheckIfUsernameAvailableQueryDto {
  @IsNotEmpty({ message: 'username query is required' })
  username: string;
}

export class CheckIfUsernameAvailableOutput extends CoreOutput {
  isAvailable?: boolean;
}

export class UpdateUserOutput extends CoreOutput {}
