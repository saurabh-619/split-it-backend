import { CoreOutput } from './../../common/dtos/output.dto';
import { MoneyRequestStatus } from './../../common/types';
import { IsEnum, IsOptional } from 'class-validator';
import { MoneyRequest } from '../entities/money-request.entity';

export class GetMoneyRequestsQuery {
  @IsOptional()
  @IsEnum(MoneyRequestStatus)
  status?: MoneyRequestStatus;
}

export class GetMoneyRequestsOutput extends CoreOutput {
  size?: number;
  moneyRequests?: MoneyRequest[];
}
