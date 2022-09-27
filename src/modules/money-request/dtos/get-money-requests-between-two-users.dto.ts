import { MoneyRequest } from '@money-request';
import { CoreOutput } from '@common';

export class GetMoneyRequestsBetweenTwoUsersOuput extends CoreOutput {
  moneyRequests?: MoneyRequest[];
}
