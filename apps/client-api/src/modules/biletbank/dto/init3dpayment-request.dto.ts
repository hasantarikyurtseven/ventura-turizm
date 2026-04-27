import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class Init3DPaymentRequestDto {
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

  /** Ödeme tutarı */
  @IsNumber()
  @Min(0)
  amount!: number;

  /** Para birimi (TRY, USD vb.) */
  @IsString()
  @IsNotEmpty()
  currency!: string;

  /** Tam ödeme: false */
  @IsBoolean()
  isPartialPayment!: boolean;

  // ── Kart Bilgileri ──────────────────────────────
  /** Kart numarası (boşluksuz 16 hane) */
  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  /** Kart üzerindeki isim */
  @IsString()
  @IsNotEmpty()
  cardHolderName!: string;

  /** Son kullanma tarihi — ay (01-12) */
  @IsString()
  @IsNotEmpty()
  expireMonth!: string;

  /** Son kullanma tarihi — yıl (iki hane, örn: 26) */
  @IsString()
  @IsNotEmpty()
  expireYear!: string;

  /** CVV / CVC (3-4 hane) */
  @IsString()
  @IsNotEmpty()
  cvv!: string;

  // ── 3D Redirect ─────────────────────────────────
  /** 3D doğrulama sonrası yönlendirilecek URL (frontend callback sayfası) */
  @IsString()
  @IsNotEmpty()
  callbackUrl!: string;

  /** Taksit seçeneği ID'si (opsiyonel) */
  @IsOptional()
  @IsString()
  installmentOptionId?: string;
}
