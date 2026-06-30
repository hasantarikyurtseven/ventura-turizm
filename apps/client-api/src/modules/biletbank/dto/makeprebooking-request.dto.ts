import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';

export class MakePrebookingBrandedItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsOptional()
  @IsString()
  brandedFareItemId?: string;

  @IsOptional()
  @IsString()
  brandedCode?: string;
}

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

  /**
   * Aynı shopping file içindeki gidiş/dönüş ürünleri
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];

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

  /**
   * ProductId bazlı branded fare eşlemesi
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MakePrebookingBrandedItemDto)
  brandedItems?: MakePrebookingBrandedItemDto[];
}
