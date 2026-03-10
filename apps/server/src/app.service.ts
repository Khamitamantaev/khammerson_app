import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const y = this.configService.get('jwt.expiresIn');
    console.log(y);
    return 'test';
  }
}
