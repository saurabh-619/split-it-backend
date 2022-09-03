import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@user';

const AuthUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return data ? req.user[data] ?? '' : req.user;
  },
);

export { AuthUser };
