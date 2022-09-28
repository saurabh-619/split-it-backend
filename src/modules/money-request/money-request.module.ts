import { WalletModule } from './../wallet/wallet.module';
import { TransactionModule } from './../transaction/transaction.module';
import { UserModule } from './../user/user.module';
import { MoneyRequest } from './entities/money-request.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyRequestService } from './money-request.service';
import { MoneyRequestController } from './money-request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoneyRequest]),
    forwardRef(() => UserModule),
    TransactionModule,
    WalletModule,
  ],
  providers: [MoneyRequestService],
  controllers: [MoneyRequestController],
  exports: [MoneyRequestService],
})
export class MoneyRequestModule {}
