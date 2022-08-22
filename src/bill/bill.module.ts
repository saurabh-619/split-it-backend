import { Bill } from '@bill/entities/bill.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Bill])],
})
export class BillModule {}
