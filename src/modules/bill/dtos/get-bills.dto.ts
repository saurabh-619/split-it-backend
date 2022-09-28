import { PaginationOuput } from './../../common/dtos/pagination.dto';

import { Bill } from '../entities/bill.entity';

export class GetBillsDto {}

export class GetBillsOuput extends PaginationOuput {
  bills?: Bill[];
}
