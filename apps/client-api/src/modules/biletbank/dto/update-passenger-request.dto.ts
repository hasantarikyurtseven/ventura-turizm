import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEmail,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

/**
 * Yolcu bilgisi DTO - UpdatePassenger NewPassengers için
 */
export class UpdatePassengerItemDto {
  @IsString()
  @IsNotEmpty()
  birthDate!: string; // YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  citizenNo!: string; // TC veya 00000000000

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string; // Serviste boşluklar kaldırılacak (JOHNSPENCER)

  @IsIn(['M', 'F'])
  gender!: string;

  @IsString()
  @IsNotEmpty()
  id!: string; // UUID

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  ifContact!: boolean;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  nationality!: string; // 2 harfli ISO (TR, US vb.)

  @IsString()
  @IsNotEmpty()
  passportCountry!: string; // 2 harfli ISO

  @IsString()
  @IsNotEmpty()
  passportNo!: string;

  @IsOptional()
  @IsString()
  passportValidDate?: string; // YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) || 0 : Number(value) ?? 0))
  @IsNumber()
  @Min(0)
  @Max(99)
  sequenceNo!: number;

  @IsString()
  @IsNotEmpty()
  tempTag!: string; // UUID

  @IsIn(['ADT', 'CHD', 'INF'])
  type!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  wheelChairServiceType?: number; // 0 veya 1
}

/**
 * UpdatePassenger istek DTO'su
 * BiletBank UpdatePassengers metodu için gerekli parametreler
 */
export class UpdatePassengerRequestDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsNotEmpty()
  sessionToken!: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  productIds!: string[]; // Allocate'tan gelen ProductId'ler

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePassengerItemDto)
  newPassengers!: UpdatePassengerItemDto[];
}
