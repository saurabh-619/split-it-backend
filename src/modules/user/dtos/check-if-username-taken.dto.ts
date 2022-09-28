import { CoreOutput } from './../../common/dtos/output.dto';
import { IsNotEmpty } from 'class-validator';

export class UsernameQueryDto {
  @IsNotEmpty({ message: 'username query is required' })
  username: string;
}

export class CheckIfUsernameAvailableOutput extends CoreOutput {
  isAvailable?: boolean;
}

export class UpdateUserOutput extends CoreOutput {}
