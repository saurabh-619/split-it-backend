import { CoreOutput } from '@common';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveBillItemDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber(undefined, { message: 'invalid price id' })
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsNumber(undefined, { message: 'invalid bill id' })
  billId: number;

  @IsOptional()
  @IsNumber(undefined, { each: true })
  friendIds?: number[];

  @IsOptional()
  @IsNumber()
  quantity?: number;
}

export class SaveBillItemOutput extends CoreOutput {
  billId?: number;
  billItemId?: number;
}
