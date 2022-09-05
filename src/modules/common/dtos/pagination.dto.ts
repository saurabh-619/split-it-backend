import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { CoreOutput } from './output.dto';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class PaginationOuput extends CoreOutput {
  size?: number;
  hasLeft?: boolean;
}
