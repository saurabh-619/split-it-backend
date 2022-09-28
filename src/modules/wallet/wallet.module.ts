import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Wallet } from './entities/wallet.entity';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), forwardRef(() => UserModule)],
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
