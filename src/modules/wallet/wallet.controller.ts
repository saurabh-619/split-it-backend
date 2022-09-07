import { User } from '@user';
import { AuthUser } from '@auth-user';
import { Controller, Get, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { MyWalletOutput } from './dtos/my-wallet.dto';
import { TransferMoneyOutput } from './dtos/transfer-money.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  myWallet(@AuthUser() user: User): Promise<MyWalletOutput> {
    return this.walletService.myWallet(user);
  }

  @Post()
  transferMoney(@AuthUser() user: User): Promise<TransferMoneyOutput> {
    return this.walletService.transferMoney(user, 7, 8, 250);
  }
}
