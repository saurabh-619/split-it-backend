import { MoneyRequest } from './entities/money-request.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MoneyRequest])],
})
export class MoneyRequestModule {}
