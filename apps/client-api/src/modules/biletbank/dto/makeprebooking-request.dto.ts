import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class MakePrebookingRequestDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsNotEmpty()
  sessionToken!: string;

  /** AirSearch'ten gelen ProductId (Allocate ve UpdatePassenger ile aynı) */
  @IsString()
  @IsNotEmpty()
  productId!: string;

  /** Mevcut alışveriş dosyası ID'si (AirSearch response'undan) */
  @IsString()
  @IsNotEmpty()
  shoppingFileId!: string;

  /** Seçilen branded fare paket ID'si (opsiyonel) */
  @IsOptional()
  @IsString()
  brandedFareItemId?: string;

  /** Branded fare paketi kodu (opsiyonel) */
  @IsOptional()
  @IsString()
  brandedCode?: string;
}
