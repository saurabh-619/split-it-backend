import { Wallet } from '@wallet/entities/wallet.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
})
export class WalletModule {}