import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequesteeIdException extends HttpException {
  constructor() {
    super(
      {
        ok: false,
        status: 400,
        error: 'bad requestee id',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
