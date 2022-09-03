import { CoreOutput } from '@common';
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional } from 'class-validator';
import { IFriendSplit } from '../interfaces/friend-split.interface';

export class GenerateBillDto {
  @IsNumber()
  billId: number;

  @IsArray({ message: 'need array of bill item ids' })
  @ArrayNotEmpty({ message: 'need to add atleast a bill item.' })
  @IsNumber(undefined, { each: true, message: 'invalid friend ids' })
  billItemIds: number[];

  @IsOptional()
  @IsNumber()
  tax: number;

  splits: IFriendSplit[];
}

export class GenerateBillOutput extends CoreOutput {}
