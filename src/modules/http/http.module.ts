import { Module } from '@nestjs/common';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { HttpService } from './http.service';

@Module({
  imports: [AxiosHttpModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
