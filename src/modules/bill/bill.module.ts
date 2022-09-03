import { Bill } from './entities/bill.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { UserModule } from '@user';

@Module({
  imports: [TypeOrmModule.forFeature([Bill]), forwardRef(() => UserModule)],
  providers: [BillService],
  controllers: [BillController],
  exports: [BillService],
})
export class BillModule {}
