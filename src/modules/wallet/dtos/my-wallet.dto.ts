import { Wallet } from './../entities/wallet.entity';
import { CoreOutput } from '@common';

export class MyWalletOutput extends CoreOutput {
  wallet?: Wallet;
}
