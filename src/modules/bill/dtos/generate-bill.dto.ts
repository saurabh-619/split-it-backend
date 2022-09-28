import { CoreOutput } from './../../common/dtos/output.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { IFriendSplit } from '../interfaces/friend-split.interface';

export class GenerateBillDto {
  @IsNumber()
  billId: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsBoolean()
  isEqualSplit?: boolean;

  @IsArray()
  @ArrayNotEmpty({ message: 'need atleast a split' })
  splits: IFriendSplit[];
}

export class GenerateBillOutput extends CoreOutput {}
