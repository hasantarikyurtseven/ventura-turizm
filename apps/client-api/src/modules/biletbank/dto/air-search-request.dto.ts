import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

/**
 * AirSearch istek DTO'su
 * Doküman: BiletBank_AirSearch_Tam_Dokumantasyon.md
 */
export class AirSearchRequestDto {
  @IsIn(['OW', 'RT', 'MP'])
  tripType!: 'OW' | 'RT' | 'MP';

  // Origin
  @IsString()
  @Length(3, 3)
  originCode!: string; // IATA veya şehir kodu

  @IsString()
  @Length(2, 2)
  originCountryCode!: string; // ülke kodu

  @IsBoolean()
  originIsCity!: boolean;

  // Destination
  @IsString()
  @Length(3, 3)
  destinationCode!: string;

  @IsString()
  @Length(2, 2)
  destinationCountryCode!: string;

  @IsBoolean()
  destinationIsCity!: boolean;

  // Dates (UI'den YYYY-MM-DD beklenir)
  @IsDateString()
  departureDate!: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  // Pax
  @IsInt()
  @Min(1)
  @Max(9)
  adults!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(8)
  children?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(8)
  infants?: number;

  // SearchOnly / SearchAndBook
  @IsIn(['SearchOnly', 'SearchAndBook'])
  searchReason!: 'SearchOnly' | 'SearchAndBook';
}

