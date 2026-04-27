import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Client tarafı member JWT doğrulama stratejisi.
 * Admin JWT ile karışmaması için 'jwt-member' adı kullanılır.
 *
 * GÜVENLİK:
 * - tokenType kontrolü: sadece 'member_access' kabul edilir
 * - Admin tokenları ile karışmaz (farklı secret + farklı tokenType)
 */
@Injectable()
export class JwtMemberStrategy extends PassportStrategy(Strategy, 'jwt-member') {
  private readonly logger = new Logger(JwtMemberStrategy.name);

  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('CLIENT_JWT_SECRET', 'client-secret-change-me'),
    });
    this.logger.log(`JwtMemberStrategy başlatıldı, secret: ${configService.get<string>('CLIENT_JWT_SECRET', 'client-secret-change-me')?.substring(0, 8)}...`);
  }

  async validate(payload: any) {
    this.logger.log(`validate çağrıldı: sub=${payload.sub}, tokenType=${payload.tokenType}`);
    // Token tipini kontrol et – admin tokenları kabul etme
    if (payload.tokenType !== 'member_access') {
      throw new UnauthorizedException('Geçersiz token tipi.');
    }

    return {
      memberId: payload.sub,
      email: payload.email,
      firstName: payload.firstName,
    };
  }
}
