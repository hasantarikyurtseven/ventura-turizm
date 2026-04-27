import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BiletbankConfig } from '../interfaces/biletbank-config.interface';

@Injectable()
export class BiletbankConfigService {
  constructor(private readonly configService: ConfigService) {}

  get config(): BiletbankConfig {
    return {
      apiUrl: this.configService.get<string>('BILETBANK_API_URL') || '',
      clientKey: this.configService.get<string>('BILETBANK_CLIENT_KEY') || '',
      username: this.configService.get<string>('BILETBANK_USERNAME') || '',
      password: this.configService.get<string>('BILETBANK_PASSWORD') || '',
      wsdlUrl: this.configService.get<string>('BILETBANK_WSDL_URL') || '',
      soapAction: this.configService.get<string>('BILETBANK_SOAP_ACTION') || '',
      channelCode: this.configService.get<string>('BILETBANK_CHANNEL_CODE') || '2',
      clientName: this.configService.get<string>('BILETBANK_CLIENT_NAME') || '',
      clientIP: this.configService.get<string>('BILETBANK_CLIENT_IP') || '',
    };
  }

  get safeConfig(): Omit<BiletbankConfig, 'password' | 'clientKey'> {
    const c = this.config;
    return {
      apiUrl: c.apiUrl,
      username: c.username,
      wsdlUrl: c.wsdlUrl,
      soapAction: c.soapAction,
      channelCode: c.channelCode,
      clientName: c.clientName,
      clientIP: c.clientIP,
    };
  }
}

