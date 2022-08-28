import { CoreOutput } from '@common';
import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail(undefined, {
    message: 'email must be a valid',
  })
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName: string;
}

export class UpdateUserOutput extends CoreOutput {}
