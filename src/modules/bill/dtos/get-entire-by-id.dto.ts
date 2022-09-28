import { CoreOutput } from './../../common/dtos/output.dto';

import { Bill } from '../entities/bill.entity';

export class GetEntireByIdOutput extends CoreOutput {
  bill?: Bill;
}
