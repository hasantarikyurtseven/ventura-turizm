import { Injectable, Logger } from '@nestjs/common';
import { BiletbankConfigService } from '../common/biletbank.config';

export interface LoginResult {
  sessionToken: string;
  sessionId?: string;
  isValid: boolean;
  expiresAt?: Date;
}

@Injectable()
export class BiletbankAuthService {
  private readonly logger = new Logger(BiletbankAuthService.name);
  private client: any;
  private wsdlUrl: string;

  constructor(private readonly cfg: BiletbankConfigService) {
    this.wsdlUrl = this.cfg.config.wsdlUrl || 'https://apitest.biletbank.com/TrevooWS.svc?singleWsdl';
  }

  private async initializeClient(): Promise<void> {
    const soap = await import('soap');
    const c = this.cfg.config;

    const options = {
      timeout: 30000,
      wsdl_options: {
        timeout: 30000,
        connection_timeout: 30000,
      },
      endpoint: c.apiUrl || undefined,
    };

    this.client = await soap.createClientAsync(this.wsdlUrl, options);

    if (c.apiUrl && this.client.setEndpoint) {
      this.client.setEndpoint(c.apiUrl);
    }

    this.logger.log('Biletbank WSDL loaded successfully (Login)');
  }

  async login(): Promise<LoginResult> {
    const c = this.cfg.config;

    if (!this.client) {
      await this.initializeClient();
    }

    const loginRequest = {
      request: {
        Form: {
          ChannelCode: c.channelCode,
          ClientIP: c.clientIP || '',
          ClientName: c.clientName,
          Password: c.password,
          Username: c.username,
        },
      },
    };

    const headers: any = { 'Client-key': c.clientKey };

    let result: any;
    if (this.client.LoginAsync) {
      [result] = await this.client.LoginAsync(loginRequest, { headers });
    } else if (this.client.Login) {
      result = await new Promise((resolve, reject) => {
        this.client.Login(loginRequest, (err: any, res: any) => (err ? reject(err) : resolve(res)), {
          headers,
        });
      });
    } else {
      throw new Error('No Login or LoginAsync method found in SOAP client');
    }

    const loginResult = result?.LoginResult || result?.[0]?.LoginResult || result;
    if (!loginResult) throw new Error('Invalid login response from Biletbank');

    const hasError = loginResult.HasError === 'true' || loginResult.HasError === true;
    const authenticationHeader = loginResult.AuthenticationHeader || loginResult.authenticationHeader;
    const sessionToken = authenticationHeader?.SessionToken || authenticationHeader?.sessionToken;
    const sessionId = authenticationHeader?.SessionId || authenticationHeader?.sessionId;

    if (hasError || !sessionToken) {
      this.logger.error('Biletbank login failed', {
        hasError,
        hasToken: !!sessionToken,
      });
      throw new Error('Biletbank login failed: Invalid credentials or session');
    }

    return {
      sessionToken,
      sessionId,
      isValid: !hasError && !!sessionToken,
      expiresAt: authenticationHeader?.ExpiresAt ? new Date(authenticationHeader.ExpiresAt) : undefined,
    };
  }
}

