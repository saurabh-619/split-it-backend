import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { CoreOutput } from './output.dto';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}

export class PaginationOuput extends CoreOutput {
  size?: number;
  hasLeft?: boolean;
}
