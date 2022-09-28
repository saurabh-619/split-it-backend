import { CoreOutput } from './../../common/dtos/output.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PayTheSplitDto {
  @IsNotEmpty({ message: 'bill id is required' })
  @IsNumber()
  billId: number;

  @IsNotEmpty({ message: 'transaction id is required' })
  @IsNumber()
  transactionId: number;
}

export class PayTheSplitOutput extends CoreOutput {}
