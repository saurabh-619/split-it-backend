import { WalletModule } from './../wallet/wallet.module';
import { TransactionModule } from './../transaction/transaction.module';
import { UserModule } from './../user/user.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { Bill } from './entities/bill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill]),
    UserModule,
    TransactionModule,
    WalletModule,
  ],
  providers: [BillService],
  controllers: [BillController],
  exports: [BillService],
})
export class BillModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply();
  }
}
