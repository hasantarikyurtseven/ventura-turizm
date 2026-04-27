import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtMemberGuard } from './guards/jwt-member.guard';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── IP Adresi Yardımcısı ───
  private getIpAddress(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded
      ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]).trim()
      : req.ip || '0.0.0.0';
  }

  /**
   * Kayıt – IP başına dakikada 5, saatte 20
   */
  @Post('register')
  @Throttle({ short: { limit: 5, ttl: 60000 }, long: { limit: 20, ttl: 3600000 } })
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(dto, this.getIpAddress(req));
  }

  /**
   * E-posta doğrulama – IP başına dakikada 10, saatte 30
   */
  @Get('verify-email')
  @Throttle({ short: { limit: 10, ttl: 60000 }, long: { limit: 30, ttl: 3600000 } })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  /**
   * Giriş – sıkı rate limit: IP başına dakikada 5, saatte 15
   *
   * GÜVENLİK:
   * - Rate limiting (brute-force koruması layer 1)
   * - Service içinde email bazlı kilitleme (layer 2)
   * - Generic hata mesajı (email enumeration önleme)
   */
  @Post('login')
  @Throttle({ short: { limit: 5, ttl: 60000 }, long: { limit: 15, ttl: 3600000 } })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.login(dto, this.getIpAddress(req), userAgent || 'unknown');
  }

  /**
   * Token yenileme – IP başına dakikada 10, saatte 60
   */
  @Post('refresh')
  @Throttle({ short: { limit: 10, ttl: 60000 }, long: { limit: 60, ttl: 3600000 } })
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Req() req: Request,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.refreshAccessToken(
      refreshToken,
      this.getIpAddress(req),
      userAgent || 'unknown',
    );
  }

  /**
   * Çıkış – mevcut oturumu kapat
   */
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  /**
   * Tüm oturumları kapat (kullanıcı giriş yapmış olmalı)
   */
  @Post('logout-all')
  @UseGuards(JwtMemberGuard)
  async logoutAll(@Req() req: any) {
    return this.authService.logoutAll(req.user.memberId);
  }

  /**
   * Profil bilgilerini getir (korumalı endpoint)
   */
  @Get('profile')
  @UseGuards(JwtMemberGuard)
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.memberId);
  }
}
