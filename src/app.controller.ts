import { __prod__ } from './utils/constant';
import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('health')
  health() {
    return {
      ok: true,
      status: 200,
      message: `server is up and running - ${
        __prod__ ? 'production' : 'development'
      } [${process.env.npm_package_version}]`,
    };
  }
}
