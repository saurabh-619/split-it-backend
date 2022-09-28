import { CoreOutput } from './../../common/dtos/output.dto';

import { Wallet } from '../entities/wallet.entity';

export class CreateWalletOutput extends CoreOutput {
  wallet?: Wallet;
}
