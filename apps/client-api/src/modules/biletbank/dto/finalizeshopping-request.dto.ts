import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class FinalizeShoppingRequestDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsNotEmpty()
  sessionToken!: string;

  @IsString()
  @IsNotEmpty()
  shoppingFileId!: string;

  @IsString()
  @IsNotEmpty()
  billingName!: string;

  @IsOptional()
  @IsString()
  addressCity?: string;

  @IsOptional()
  @IsString()
  addressDetail?: string;

  @IsOptional()
  @IsString()
  addressDistrict?: string;

  @IsOptional()
  @IsString()
  addressZipCode?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsNumber()
  ifCompany?: number;

  @IsOptional()
  @IsString()
  taxNo?: string;

  @IsOptional()
  @IsString()
  taxOffice?: string;
}
