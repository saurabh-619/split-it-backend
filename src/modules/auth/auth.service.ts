import { HttpService } from '@http';
import { JwtService } from '@jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from '@user';
import { ValidationService } from '@validation';
import { WalletService } from '@wallet';
import { PinoLogger } from 'nestjs-pino';
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

      const result = await this.userService.insert(newUser);

      // generate token
      const token = this.jwtService.sign({
        id: result.identifiers[0].id,
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
      const user = await this.userService.getUserByUsernameWithWallet(username);

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
        id: user.id,
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