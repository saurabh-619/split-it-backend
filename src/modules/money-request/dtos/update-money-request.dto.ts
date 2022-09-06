import { CoreOutput, MoneyRequestStatus } from '@common';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMoneyRequestDto {
  @IsNumber(undefined, { message: 'request id should be valid number' })
  @IsNotEmpty({ message: 'request id is required field' })
  requestId: number;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'title is too short' })
  @MaxLength(150, { message: 'title is too long' })
  @IsNotEmpty({ message: 'title is required field' })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(35, { message: 'description is too short' })
  @MaxLength(3000, { message: 'description is too long' })
  description?: string;

  @IsOptional()
  @IsNumber(undefined, { message: 'amount should be valid number' })
  amount?: number;

  @IsOptional()
  @IsEnum(MoneyRequestStatus, { message: 'invalid status update request' })
  status?: MoneyRequestStatus;
}

export class UpdateMoneyRequestOutput extends CoreOutput {}
