import { AuthUser } from '@auth-user';
import { Controller, Get } from '@nestjs/common';
import { User } from '@user';
import { MyWalletOutput } from './dtos/my-wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  myWallet(@AuthUser() user: User): Promise<MyWalletOutput> {
    return this.walletService.myWallet(user);
  }

  // @Post()
  // transferMoney(@AuthUser() user: User): Promise<TransferMoneyOutput> {
  //   return this.walletService.transferMoney(user, 7, 8, 250);
  // }
}
