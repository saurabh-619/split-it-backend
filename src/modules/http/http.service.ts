import { UNSPLASH_BASE_URL } from './../../utils/constant';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GetRandomAvatarOutput } from './dtos/get-random-avatar';

@Injectable()
export class HttpService {
  constructor(private readonly httpService: AxiosHttpService) {}

  async getRandomAvatar(): Promise<GetRandomAvatarOutput> {
    try {
      const res = await this.httpService.axiosRef.get(
        `${UNSPLASH_BASE_URL}/photos/random/?query=profile&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
      );
      return {
        ok: true,
        status: 200,
        avatar: res.data.urls.regular ?? '',
      };
    } catch (e) {
      return {
        ok: false,
        status: 500,
        error: "couldn't fetch image from unsplash",
      };
    }
  }
}
