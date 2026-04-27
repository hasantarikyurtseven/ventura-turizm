import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsBoolean,
  IsOptional,
  Equals,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Kayıt DTO'su – tüm alanlar validate + sanitize edilir
 * whitelist: true + forbidNonWhitelisted: true → beklenmeyen alanlar reddedilir
 * transform: true → class-transformer dönüşümleri uygulanır
 */
export class RegisterDto {
  @IsNotEmpty({ message: 'Ad zorunludur' })
  @IsString()
  @MinLength(2, { message: 'Ad en az 2 karakter olmalıdır' })
  @MaxLength(50, { message: 'Ad en fazla 50 karakter olabilir' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  firstName: string;

  @IsNotEmpty({ message: 'Soyad zorunludur' })
  @IsString()
  @MinLength(2, { message: 'Soyad en az 2 karakter olmalıdır' })
  @MaxLength(50, { message: 'Soyad en fazla 50 karakter olabilir' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  lastName: string;

  @IsNotEmpty({ message: 'E-posta zorunludur' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase().trim() : value)
  email: string;

  @IsNotEmpty({ message: 'Telefon zorunludur' })
  @IsString()
  @Matches(/^[0-9]{10,11}$/, { message: 'Geçerli bir telefon numarası giriniz (10-11 haneli)' })
  phone: string;

  @IsNotEmpty({ message: 'Şifre zorunludur' })
  @MinLength(8, { message: 'Şifre en az 8 karakter olmalıdır' })
  @MaxLength(72, { message: 'Şifre en fazla 72 karakter olabilir' }) // bcrypt 72 byte sınırı – DoS önleme
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
  })
  password: string;

  @IsBoolean()
  @Equals(true, { message: 'Kullanım şartlarını kabul etmelisiniz' })
  acceptTerms: boolean;

  @IsBoolean()
  @Equals(true, { message: 'Gizlilik politikasını kabul etmelisiniz' })
  acceptPrivacy: boolean;

  @IsOptional()
  @IsBoolean()
  acceptMarketing?: boolean;
}
