import { CoreOutput } from './../../common/dtos/output.dto';

export class RemoveBillItemDto {
  billId?: number;
  billItemId?: number;
}

export interface RemoveBillItemOutput extends CoreOutput {
  billId?: number;
}
