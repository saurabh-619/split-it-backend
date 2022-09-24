import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throllerOptions: ThrottlerModuleOptions = {
  ttl: 60,
  limit: 60,
};
