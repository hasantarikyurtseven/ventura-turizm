import {
  IsString,
  IsOptional,
  IsNotEmpty,
  ValidateIf,
  IsNumber,
  Min,
} from 'class-validator';

/**
 * Allocate (Koltuk Tahsisi) istek DTO'su
 * BiletBank Allocate metodu için gerekli parametreler
 */
export class AllocateRequestDto {
  /**
   * AirSearch response'undan gelen ProductId
   * Her AirSearch'te ProductId'ler yenilenir, en son AirSearch'ten alınmalı
   */
  @IsString()
  @IsNotEmpty()
  productId!: string;

  /**
   * Seçilen branded fare paket ID'si (opsiyonel)
   * Eğer kullanıcı bir paket seçtiyse (ör. SUPER_ECO, ECO, FLEX) bu ID gönderilir
   */
  @IsOptional()
  @IsString()
  brandedFareItemId?: string;

  /**
   * AirSearch ile aynı session'ın SessionId'si
   * Aynı Login session'ı kullanılmalı
   */
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  /**
   * AirSearch ile aynı session'ın SessionToken'ı
   * Aynı Login session'ı kullanılmalı
   */
  @IsString()
  @IsNotEmpty()
  sessionToken!: string;

  /**
   * AirSearch'ten dönen ShoppingFileId
   * Aynı shopping file içindeki ürünler için kullanılır
   */
  @IsString()
  @IsNotEmpty()
  shoppingFileId!: string;

  /**
   * RecommendationBox için FlightId (opsiyonel)
   * Eğer RecommendationBox seçildiyse ProductId ile birlikte FlightId de gönderilir
   */
  @IsOptional()
  @IsString()
  flightId?: string;

  /**
   * SelectedServiceFee/Amount - Komisyon miktarı (zorunlu)
   * Seller'ın komisyonu. Komisyon hesaplaması gerekmiyorsa 0 gönderilir.
   * Decimal değer olabilir (2 hane kuralı).
   * Default: 0
   */
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'SelectedServiceFeeAmount geçerli bir sayı olmalıdır.' })
  @Min(0, { message: 'SelectedServiceFeeAmount negatif olamaz.' })
  selectedServiceFeeAmount?: number;
}
