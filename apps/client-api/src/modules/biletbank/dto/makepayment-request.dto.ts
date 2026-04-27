import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class MakePaymentRequestDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsNotEmpty()
  sessionToken!: string;

  /** MakePreBooking response'undan gelen ShoppingFileId */
  @IsString()
  @IsNotEmpty()
  shoppingFileId!: string;

  /** Ödeme tutarı (MakePreBooking'den gelen RemainingSum veya TotalFare) */
  @IsNumber()
  @Min(0)
  amount!: number;

  /** Para birimi (TRY, USD vb.) */
  @IsString()
  @IsNotEmpty()
  currency!: string;

  /**
   * Kısmi ödeme mi?
   * false → Tam ödeme (tam tutar ödeniyor)
   * true  → Kısmi ödeme (toplam tutarın bir kısmı ödeniyor)
   */
  @IsBoolean()
  isPartialPayment!: boolean;

  /**
   * Ödeme tipi
   * RA_BALANCE_PAYMENT → Running Account (cari hesap) ile ödeme
   * Diğer tipler: CC_PAYMENT (kredi kartı, ayrı entegrasyon gerektirir)
   */
  @IsString()
  @IsNotEmpty()
  paymentType!: string;

  /** Son satıcı komisyonu düşülsün mü? Varsayılan: false */
  @IsOptional()
  @IsBoolean()
  deductLastSellerCommission?: boolean;
}
