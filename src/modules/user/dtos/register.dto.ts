import { CoreOutput } from '@common';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsEmail(undefined, {
    message: 'email must be a valid',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @MinLength(3, {
    message: 'password is too short',
  })
  @MaxLength(30, {
    message: 'password is too long',
  })
  password: string;
}

export class RegisterOutput extends CoreOutput {
  token?: string;
}
