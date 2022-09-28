import { CoreOutput } from './../../common/dtos/output.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class InsertBillDto {
  @IsString()
  @IsNotEmpty({ message: "title can't be empty" })
  @MinLength(8, { message: "title can't be too short" })
  @MaxLength(200, { message: "title can't be too long" })
  title: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsString()
  @MinLength(20, { message: "description can't be too short" })
  @MaxLength(3000, { message: "description can't be too long" })
  description?: string;
}

export class InsertBillOuput extends CoreOutput {
  billId?: number;
}
