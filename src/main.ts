import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
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
  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
