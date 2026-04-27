import { Controller, Get } from '@nestjs/common';
import { BiletbankAuthService } from './auth/auth.service';
import { BiletbankConfigService } from './common/biletbank.config';

@Controller('biletbank')
export class BiletbankController {
  constructor(
    private readonly auth: BiletbankAuthService,
    private readonly cfg: BiletbankConfigService,
  ) {}

  @Get('test')
  async test() {
    const loginResult = await this.auth.login();
    return {
      success: true,
      message: 'Biletbank connection successful',
      sessionValid: loginResult.isValid,
      sessionId: loginResult.sessionId,
      config: this.cfg.safeConfig,
    };
  }
}

