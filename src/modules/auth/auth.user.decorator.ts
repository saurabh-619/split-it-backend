import { User } from './../user/entities/User.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const AuthUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return data ? req.user[data] ?? '' : req.user;
  },
);

export { AuthUser };
