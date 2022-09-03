import { CoreOutput } from '@common';
import { Bill } from '../entities/bill.entity';

export class GetEntireByIdOutput extends CoreOutput {
  bill?: Bill;
}
