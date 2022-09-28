import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HttpService } from './../http/http.service';
import { JwtService } from './../jwt/jwt.service';
import { UserService } from './../user/user.service';
import { ValidationService } from './../validation/validation.service';
import { WalletService } from './../wallet/wallet.service';
import { LoginDto, LoginOutput } from './dtos/login.dto';
import { RegisterDto, RegisterOutput } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly validationService: ValidationService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterOutput> {
    const { email, firstName, lastName, password, username } = registerDto;
    try {
      // check if user already exists
      const userByEmail = await this.userService.getUserByEmail(
        registerDto.email,
      );
      const userByUsername = await this.userService.getUserByUsername(
        registerDto.username,
      );

      if (userByEmail !== null || userByUsername !== null) {
        return {
          ok: false,
          status: 400,
          error: 'user with the given info already exists',
        };
      }

      // create salt and password hash
      const salt = await this.validationService.generateSalt();
      const passwordHash = await this.validationService.generatePasswordHash(
        salt,
        password,
      );

      // create wallet and user
      const {
        ok,
        error: createWalletError,
        wallet,
      } = await this.walletService.createWallet(username);

      if (!ok) {
        throw new Error(createWalletError);
      }

      // get avatar
      const { avatar } = await this.httpService.getRandomAvatar();

      const newUser = this.userService.create({
        email,
        firstName,
        lastName,
        username,
        wallet,
        passwordHash,
        salt,
        avatar,
      });

      const userResult = await this.userService.save(newUser);
      await this.walletService.update({ ...wallet, owner: userResult });

      // generate token
      const token = this.jwtService.sign({
        id: userResult.id,
        email,
        username,
      });

      return {
        ok: true,
        status: 201,
        token,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't create user",
      };
    }
  }

  async login(loginDto: LoginDto): Promise<LoginOutput> {
    const { password, username } = loginDto;
    try {
      // check if user already exists
      const user =
        await this.userService.getUserByUsernameWithWalletWithsaltAndHash(
          username,
        );

      if (user === null) {
        return {
          ok: false,
          status: 400,
          error: 'wrong credentials',
        };
      }

      // check the password
      const doesPasswordMatch = await this.validationService.validatePassword(
        user.salt,
        user.passwordHash,
        password,
      );

      if (!doesPasswordMatch) {
        return {
          ok: false,
          status: 400,
          error: 'wrong credentials',
        };
      }

      // generate token
      const token = this.jwtService.sign({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        id: user.ownerId,
        email: user.email,
        username: user.username,
      });

      return {
        ok: true,
        status: 201,
        token,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't find user",
      };
    }
  }
}
