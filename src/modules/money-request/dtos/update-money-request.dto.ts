import { CoreOutput } from './../../common/dtos/output.dto';
import { MoneyRequestStatus } from './../../common/types';
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
  @IsNumber(undefined, { message: 'request id should be a valid number' })
  @IsNotEmpty({ message: 'request id is required field' })
  requestId: number;

  @IsNumber(undefined, { message: 'transaction id should be a valid number' })
  @IsNotEmpty({ message: 'transaction id is required field' })
  transactionId: number;

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
  @IsString()
  @MinLength(35, { message: 'requestee remark is too short' })
  @MaxLength(3000, { message: 'requestee remark is too long' })
  requesteeRemark?: string;

  @IsOptional()
  @IsNumber(undefined, { message: 'amount should be valid number' })
  amount?: number;

  @IsOptional()
  @IsEnum(MoneyRequestStatus, { message: 'invalid status update request' })
  status?: MoneyRequestStatus;
}

export class UpdateMoneyRequestOutput extends CoreOutput {}
