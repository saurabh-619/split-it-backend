import { CoreOutput } from './../../common/dtos/output.dto';
import { Wallet } from './../entities/wallet.entity';

export class MyWalletOutput extends CoreOutput {
  wallet?: Wallet;
}
