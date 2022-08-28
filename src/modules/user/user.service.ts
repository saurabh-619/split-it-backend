import { pickBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { UpdateUserDto, UpdateUserOutput } from './dtos/update-user.dto';
import { User } from './entities/User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async me(): Promise<string> {
    return 'user';
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['wallet'],
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        username,
      },
    });
  }

  async getUserByUsernameWithWallet(username: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        username,
      },
      relations: ['wallet'],
    });
  }

  create(user: Partial<User>): User {
    return this.userRepo.create({
      ...user,
    });
  }

  async insert(user: Partial<User>): Promise<InsertResult> {
    return this.userRepo.insert({
      ...user,
    });
  }

  async update(
    user: User,
    updates: Partial<UpdateUserDto>,
  ): Promise<UpdateUserOutput> {
    try {
      updates.email = updates.email === user.email ? undefined : updates.email;
      updates.username =
        updates.username === user.username ? undefined : updates.username;

      updates = pickBy(updates, (x) => x !== undefined);

      // check if user already exists
      if (updates.email) {
        const userByEmail = await this.getUserByEmail(updates.email);
        if (userByEmail !== null) {
          return {
            ok: false,
            status: 400,
            error: 'user with the given email already exists',
          };
        }
      }

      if (updates.username) {
        const userByUsername = await this.getUserByUsername(updates.username);
        if (userByUsername !== null) {
          return {
            ok: false,
            status: 400,
            error: 'user with the given username already exists',
          };
        }
      }

      await this.userRepo.update(user.id, {
        ...updates,
      });

      return {
        ok: true,
        status: 201,
      };
    } catch (e) {
      return {
        ok: false,
        status: 500,
        error: "couldn't update the user",
      };
    }
  }
}
