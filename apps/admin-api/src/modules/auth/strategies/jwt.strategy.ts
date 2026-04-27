import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET', 'secret'),
        });
    }

    async validate(payload: any) {
        if (payload.tokenType !== 'admin_access') {
            throw new UnauthorizedException('Invalid token type');
        }
        return { userId: payload.sub, username: payload.username, roles: payload.roles };
    }
}
