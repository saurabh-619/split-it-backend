import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Response } from 'express';

import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (valError) => {
        const error =
          valError[0].constraints[Object.keys(valError[0].constraints)[0]];
        throw new HttpException(
          {
            ok: false,
            status: 400,
            error,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  app.useGlobalFilters({
    catch(exception: HttpException, host) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      const status =
        exception && typeof exception.getStatus === 'function'
          ? exception.getStatus()
          : 500;

      if (status === 429) {
        response.status(status).json({
          ok: false,
          status,
          error: 'too many requests. wait for some time',
        });
      } else {
        response.status(status).json({
          ok: false,
          status,

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          error: exception?.response?.error ?? 'internal server error',
        });
      }
    },
  });

  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
