import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Member, MemberSchema } from './schemas/member.schema';
import { MemberRefreshToken, MemberRefreshTokenSchema } from './schemas/refresh-token.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtMemberStrategy } from './strategies/jwt-member.strategy';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: MemberRefreshToken.name, schema: MemberRefreshTokenSchema },
    ]),
    BullModule.registerQueue({ name: 'email-verification' }),
    PassportModule.register({ defaultStrategy: 'jwt-member' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('CLIENT_JWT_SECRET', 'client-secret-change-me'),
        signOptions: {
          expiresIn: configService.get<string>('CLIENT_JWT_ACCESS_EXPIRES', '15m') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtMemberStrategy],
  exports: [AuthService, JwtMemberStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
