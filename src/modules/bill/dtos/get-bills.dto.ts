import { User } from './../../user/entities/User.entity';
import { PaginationOuput } from './../../common/dtos/pagination.dto';

import { Bill } from '../entities/bill.entity';

export class GetBillsDto {}

class PaymentInfo {
  hasPaid: boolean;
  amount: number;
}

export class FriendsWithPaymentInfo extends User {
  paymentInfo: PaymentInfo;
}

export class BillOuput extends Bill {
  leader: FriendsWithPaymentInfo;
  friends?: FriendsWithPaymentInfo[];
}

export class GetBillsOuput extends PaginationOuput {
  bills?: BillOuput[];
}
