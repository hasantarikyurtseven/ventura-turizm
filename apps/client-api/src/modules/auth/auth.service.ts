import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bullmq';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Member } from './schemas/member.schema';
import { MemberRefreshToken } from './schemas/refresh-token.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /** Başarısız giriş sayacı – bellek içi (basit brute-force koruması) */
  private failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 dakika

  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(MemberRefreshToken.name) private refreshTokenModel: Model<MemberRefreshToken>,
    @InjectQueue('email-verification') private emailQueue: Queue,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  // ═══════════════════════════════════════════════
  //  KAYIT (REGISTER)
  // ═══════════════════════════════════════════════

  /**
   * HTML özel karakterlerini escape et – XSS önleme (e-posta şablonu için)
   */
  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  /**
   * Yeni üye kaydı oluştur
   *
   * GÜVENLİK:
   * - Email enumeration koruması: kayıtlı olsa da aynı mesaj döner
   * - bcrypt ile şifre hash (salt 10)
   * - crypto.randomUUID() ile kriptografik token
   * - IP adresi sözleşme onaylarıyla birlikte kaydedilir
   */
  async register(dto: RegisterDto, ipAddress: string): Promise<{ success: boolean; message: string }> {
    const email = dto.email.toLowerCase().trim();

    // Email enumeration önleme
    const existing = await this.memberModel.findOne({ email });
    if (existing) {
      this.logger.warn(`Kayıt denemesi: zaten kayıtlı e-posta: ${email} (IP: ${ipAddress})`);
      return {
        success: true,
        message: 'Kayıt işleminiz alındı. E-posta adresinize onay linki gönderildi. Lütfen e-postanızı kontrol edin.',
      };
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationToken = crypto.randomUUID();
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const now = new Date();
    const contractAcceptances: Array<{ slug: string; acceptedAt: Date; ipAddress: string }> = [];

    if (dto.acceptTerms) {
      contractAcceptances.push(
        { slug: 'kullanim-sartlari', acceptedAt: now, ipAddress },
        { slug: 'gizlilik-sartlari', acceptedAt: now, ipAddress },
      );
    }
    if (dto.acceptPrivacy) {
      contractAcceptances.push(
        { slug: 'kisisel-verilerin-korunmasi', acceptedAt: now, ipAddress },
        { slug: 'gizlilik-politikasi', acceptedAt: now, ipAddress },
      );
    }

    const member = new this.memberModel({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email,
      phone: dto.phone.trim(),
      passwordHash,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiresAt,
      status: 'pending',
      contractAcceptances,
      marketingConsent: dto.acceptMarketing ?? false,
    });

    await member.save();
    this.logger.log(`Yeni üye kaydedildi: ${member.email} (IP: ${ipAddress})`);

    const clientWebUrl = this.configService.get<string>('CLIENT_WEB_URL', 'http://localhost:4300');
    await this.emailQueue.add(
      'send-verification',
      {
        email: member.email,
        firstName: this.escapeHtml(member.firstName),
        verificationToken,
        clientWebUrl,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return {
      success: true,
      message: 'Kayıt işleminiz alındı. E-posta adresinize onay linki gönderildi. Lütfen e-postanızı kontrol edin.',
    };
  }

  // ═══════════════════════════════════════════════
  //  E-POSTA DOĞRULAMA
  // ═══════════════════════════════════════════════

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    if (!token || token.length < 30 || token.length > 50) {
      throw new BadRequestException('Onay linki geçersiz.');
    }

    const member = await this.memberModel.findOne({ verificationToken: token });

    if (!member) {
      throw new BadRequestException('Onay linki geçersiz veya daha önce kullanılmış.');
    }

    if (member.verificationTokenExpiresAt && member.verificationTokenExpiresAt < new Date()) {
      await this.memberModel.updateOne(
        { _id: member._id },
        { $unset: { verificationToken: '', verificationTokenExpiresAt: '' } },
      );
      throw new BadRequestException('Onay linkinin süresi dolmuş. Lütfen yeniden kayıt olun.');
    }

    await this.memberModel.updateOne(
      { _id: member._id },
      {
        $set: { emailVerified: true, status: 'active' },
        $unset: { verificationToken: '', verificationTokenExpiresAt: '' },
      },
    );

    this.logger.log(`E-posta onaylandı: ${member.email}`);

    return {
      success: true,
      message: 'E-posta adresiniz başarıyla onaylandı. Artık giriş yapabilirsiniz.',
    };
  }

  // ═══════════════════════════════════════════════
  //  GİRİŞ (LOGIN)
  // ═══════════════════════════════════════════════

  /**
   * Üye girişi
   *
   * GÜVENLİK:
   * - Brute-force koruması: 5 başarısız deneme → 15 dk kilitleme
   * - Timing-safe karşılaştırma (bcrypt.compare zaten constant-time)
   * - Email enumeration önleme: yanlış e-posta veya şifrede aynı hata mesajı
   * - Sadece aktif ve e-postası doğrulanmış hesaplar giriş yapabilir
   * - Refresh token hash'lenerek DB'de saklanır (çalınsa bile kullanılamaz)
   * - lastLoginAt ve lastLoginIp kaydedilir
   */
  async login(
    dto: LoginDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<{
    success: boolean;
    accessToken: string;
    refreshToken: string;
    user: { firstName: string; lastName: string; email: string };
  }> {
    const email = dto.email.toLowerCase().trim();

    // 1. Brute-force kontrolü
    this.checkBruteForce(email);

    // 2. Kullanıcıyı bul
    const member = await this.memberModel.findOne({ email }).select('+passwordHash');

    if (!member) {
      this.recordFailedAttempt(email);
      // GÜVENLİK: E-posta'nın var olup olmadığını açıklama
      throw new UnauthorizedException('E-posta adresi veya şifre hatalı.');
    }

    // 3. Şifre kontrolü (bcrypt constant-time)
    const isPasswordValid = await bcrypt.compare(dto.password, member.passwordHash);
    if (!isPasswordValid) {
      this.recordFailedAttempt(email);
      throw new UnauthorizedException('E-posta adresi veya şifre hatalı.');
    }

    // 4. Hesap durumu kontrolü
    if (!member.emailVerified) {
      throw new UnauthorizedException('Lütfen önce e-posta adresinizi doğrulayın.');
    }

    if (member.status === 'suspended') {
      throw new UnauthorizedException('Hesabınız askıya alınmıştır. Destek ile iletişime geçin.');
    }

    if (member.status !== 'active') {
      throw new UnauthorizedException('Hesabınız henüz aktif değil.');
    }

    // 5. Başarılı giriş – sayacı sıfırla
    this.clearFailedAttempts(email);

    // 6. Token üret
    const tokens = await this.generateTokens(member, ipAddress, userAgent);

    // 7. Son giriş bilgilerini güncelle
    await this.memberModel.updateOne(
      { _id: member._id },
      { $set: { lastLoginAt: new Date(), lastLoginIp: ipAddress } },
    );

    this.logger.log(`Üye girişi başarılı: ${email} (IP: ${ipAddress})`);

    return {
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
      },
    };
  }

  // ═══════════════════════════════════════════════
  //  TOKEN YENİLEME (REFRESH)
  // ═══════════════════════════════════════════════

  /**
   * Refresh token ile yeni access token al
   *
   * GÜVENLİK:
   * - Refresh token hash'lenerek saklanır
   * - Tek kullanımlık: yenilendikten sonra eski token iptal edilir (rotation)
   * - Token çalınırsa bile hash olmadan kullanılamaz
   * - Süresi dolmuş tokenlar MongoDB TTL ile otomatik silinir
   */
  async refreshAccessToken(
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<{
    success: boolean;
    accessToken: string;
    refreshToken: string;
  }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token gerekli.');
    }

    // Hash'le ve DB'de ara
    const tokenHash = this.hashToken(refreshToken);
    const storedToken = await this.refreshTokenModel.findOne({
      tokenHash,
      revoked: false,
    });

    if (!storedToken) {
      throw new UnauthorizedException('Geçersiz veya iptal edilmiş oturum.');
    }

    // Süre kontrolü
    if (storedToken.expiresAt < new Date()) {
      await this.refreshTokenModel.updateOne(
        { _id: storedToken._id },
        { $set: { revoked: true, revokedReason: 'expired' } },
      );
      throw new UnauthorizedException('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
    }

    // Eski refresh token'ı iptal et (rotation)
    await this.refreshTokenModel.updateOne(
      { _id: storedToken._id },
      { $set: { revoked: true, revokedReason: 'rotated' } },
    );

    // Kullanıcıyı bul
    const member = await this.memberModel.findById(storedToken.memberId);
    if (!member || member.status !== 'active') {
      throw new UnauthorizedException('Hesap aktif değil.');
    }

    // Yeni token çifti üret
    const tokens = await this.generateTokens(member, ipAddress, userAgent);

    return {
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // ═══════════════════════════════════════════════
  //  ÇIKIŞ (LOGOUT)
  // ═══════════════════════════════════════════════

  /**
   * Oturumu kapat – refresh token'ı iptal et
   */
  async logout(refreshToken: string): Promise<{ success: boolean; message: string }> {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.refreshTokenModel.updateOne(
        { tokenHash },
        { $set: { revoked: true, revokedReason: 'logout' } },
      );
    }

    return { success: true, message: 'Çıkış yapıldı.' };
  }

  /**
   * Kullanıcının tüm oturumlarını kapat
   */
  async logoutAll(memberId: string): Promise<{ success: boolean; message: string }> {
    await this.refreshTokenModel.updateMany(
      { memberId: new Types.ObjectId(memberId), revoked: false },
      { $set: { revoked: true, revokedReason: 'logout_all' } },
    );

    return { success: true, message: 'Tüm oturumlardan çıkış yapıldı.' };
  }

  // ═══════════════════════════════════════════════
  //  PROFİL
  // ═══════════════════════════════════════════════

  async getProfile(memberId: string) {
    const member = await this.memberModel
      .findById(memberId)
      .select('firstName lastName email phone emailVerified status marketingConsent createdAt')
      .lean();

    if (!member) {
      throw new UnauthorizedException('Kullanıcı bulunamadı.');
    }

    return { success: true, user: member };
  }

  // ═══════════════════════════════════════════════
  //  YARDIMCI METODLAR
  // ═══════════════════════════════════════════════

  /**
   * Access + Refresh token çifti üret
   */
  private async generateTokens(
    member: Member,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessExpiresIn = this.configService.get<string>('CLIENT_JWT_ACCESS_EXPIRES', '15m');
    const refreshExpiresIn = this.configService.get<string>('CLIENT_JWT_REFRESH_EXPIRES', '7d');

    // Access token (kısa ömürlü)
    const accessPayload = {
      sub: member._id.toString(),
      email: member.email,
      firstName: member.firstName,
      tokenType: 'member_access',
    };
    const accessToken = this.jwtService.sign(accessPayload, { expiresIn: accessExpiresIn as any });

    // Refresh token (uzun ömürlü, opaque random string)
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenHash = this.hashToken(refreshToken);

    // Refresh süresini hesapla
    const refreshMs = this.parseDuration(refreshExpiresIn);
    const expiresAt = new Date(Date.now() + refreshMs);

    // DB'ye hash'lenmiş olarak kaydet
    await this.refreshTokenModel.create({
      memberId: member._id,
      tokenHash: refreshTokenHash,
      expiresAt,
      ipAddress,
      userAgent: userAgent?.substring(0, 500) || 'unknown', // User-agent sınırla
      revoked: false,
    });

    // Kullanıcının en fazla 10 aktif oturumu olsun
    const activeSessions = await this.refreshTokenModel
      .find({ memberId: member._id, revoked: false })
      .sort({ createdAt: 1 })
      .exec();

    if (activeSessions.length > 10) {
      const toRevoke = activeSessions.slice(0, activeSessions.length - 10);
      const idsToRevoke = toRevoke.map((s) => s._id);
      await this.refreshTokenModel.updateMany(
        { _id: { $in: idsToRevoke } },
        { $set: { revoked: true, revokedReason: 'max_sessions' } },
      );
    }

    return { accessToken, refreshToken };
  }

  /**
   * Token'ı SHA-256 ile hash'le (DB'de plain text saklamama)
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Duration string'i ms'ye çevir (örn: "7d" → 604800000)
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 gün

    const value = parseInt(match[1], 10);
    switch (match[2]) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }

  // ─── Brute-Force Koruması ───

  private checkBruteForce(email: string): void {
    const record = this.failedAttempts.get(email);
    if (!record) return;

    if (
      record.count >= this.MAX_FAILED_ATTEMPTS &&
      Date.now() - record.lastAttempt < this.LOCKOUT_DURATION
    ) {
      const remainingMinutes = Math.ceil(
        (this.LOCKOUT_DURATION - (Date.now() - record.lastAttempt)) / 60000,
      );
      throw new UnauthorizedException(
        `Çok fazla başarısız giriş denemesi. Lütfen ${remainingMinutes} dakika sonra tekrar deneyin.`,
      );
    }

    // Kilit süresi dolduysa sıfırla
    if (Date.now() - record.lastAttempt >= this.LOCKOUT_DURATION) {
      this.failedAttempts.delete(email);
    }
  }

  private recordFailedAttempt(email: string): void {
    const record = this.failedAttempts.get(email);
    if (record) {
      record.count++;
      record.lastAttempt = Date.now();
    } else {
      this.failedAttempts.set(email, { count: 1, lastAttempt: Date.now() });
    }
  }

  private clearFailedAttempts(email: string): void {
    this.failedAttempts.delete(email);
  }
}
