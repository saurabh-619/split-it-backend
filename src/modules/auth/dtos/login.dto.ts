import { CoreOutput } from './../../common/dtos/output.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginOutput extends CoreOutput {
  token?: string;
}
