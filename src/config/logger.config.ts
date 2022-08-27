import { Params } from 'nestjs-pino';

export const loggerOptions: Params = {
  pinoHttp: {
    redact: ['req', 'res'],
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: `${new Date(Date.now()).toLocaleString()}`,
        singleLine: true,
      },
    },
  },
};
