import { CoreOutput } from '@common';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendMoneyRequestDto {
  @IsString({ message: 'title should be valid string' })
  @MinLength(10, { message: 'title is too short' })
  @MaxLength(150, { message: 'title is too long' })
  @IsNotEmpty({ message: 'title is required field' })
  title: string;

  @IsOptional()
  @IsString({ message: 'description should be valid string' })
  @MinLength(35, { message: 'description is too short' })
  @MaxLength(3000, { message: 'description is too long' })
  description?: string;

  @IsNumber(undefined, { message: 'amount should be valid number' })
  @IsNotEmpty({ message: 'amount is required field' })
  amount: number;

  @IsNumber(undefined, { message: 'requestee id should be valid number' })
  @IsNotEmpty({ message: 'requestee id is required field' })
  requesteeId: number;
}

export class SendMoneyRequestOutput extends CoreOutput {
  requestId?: number;
  transactionId?: number;
}
