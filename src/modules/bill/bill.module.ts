import { WalletModule } from '@wallet';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from '@transaction';
import { UserModule } from '@user';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { Bill } from './entities/bill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill]),
    forwardRef(() => UserModule),
    TransactionModule,
    WalletModule,
  ],
  providers: [BillService],
  controllers: [BillController],
  exports: [BillService],
})
export class BillModule {}
