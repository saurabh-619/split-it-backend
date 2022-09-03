import { CoreOutput } from '@common';

export class RemoveBillItemDto {
  billId?: number;
  billItemId?: number;
}

export interface RemoveBillItemOutput extends CoreOutput {
  billId?: number;
}
