import { MoneyRequest } from './../entities/money-request.entity';
import { CoreOutput } from './../../common/dtos/output.dto';

export class GetMoneyRequestsBetweenTwoUsersOuput extends CoreOutput {
  moneyRequests?: MoneyRequest[];
}
