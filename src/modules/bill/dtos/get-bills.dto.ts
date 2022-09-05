import { PaginationOuput } from '@common';
import { Bill } from '../entities/bill.entity';

export class GetBillsDto {}

export class GetBillsOuput extends PaginationOuput {
  bills?: Bill[];
}
