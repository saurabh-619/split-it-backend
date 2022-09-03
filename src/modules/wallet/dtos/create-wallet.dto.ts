import { CoreOutput } from '@common';
import { Wallet } from '../entities/wallet.entity';

export class CreateWalletOutput extends CoreOutput {
  wallet?: Wallet;
}
