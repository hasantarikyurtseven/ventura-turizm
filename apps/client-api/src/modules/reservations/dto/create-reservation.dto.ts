import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsIn,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PassengerDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() type: string;
  @IsOptional() @IsString() @MaxLength(32) citizenNo?: string;
  @IsOptional() @IsString() @MaxLength(64) passportNo?: string;
  @IsOptional() @IsString() @MaxLength(32) passportCountry?: string;
  @IsOptional() @IsString() @MaxLength(32) passportValidDate?: string;
  @IsOptional() @IsString() @MaxLength(32) birthDate?: string;
  @IsOptional() @IsString() @MaxLength(8) gender?: string;
  @IsOptional() @IsString() @MaxLength(8) nationality?: string;
  @IsOptional() @IsString() @MaxLength(16) idType?: string;
  @IsOptional() @IsString() @MaxLength(256) email?: string;
  @IsOptional() @IsString() @MaxLength(32) phone?: string;
}

export class FlightPointDto {
  @IsString() @IsNotEmpty() airportCode: string;
  @IsOptional() @IsString() airportName?: string;
  @IsOptional() @IsString() airport?: string;
  @IsOptional() @IsString() city?: string;
  @IsString() @IsNotEmpty() time: string;
  @IsString() @IsNotEmpty() date: string;
}

export class FlightDto {
  @IsString() @IsNotEmpty() airline: string;
  @IsOptional() @IsString() airlineLogo?: string;
  @IsString() @IsNotEmpty() flightNumber: string;
  @ValidateNested() @Type(() => FlightPointDto) departure: FlightPointDto;
  @ValidateNested() @Type(() => FlightPointDto) arrival: FlightPointDto;
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsString() cabinClass?: string;
  @IsOptional() @IsString() brandName?: string;
  @IsOptional() @IsString() baggageDescription?: string;
  @IsOptional() @IsNumber() fare?: number;
  @IsOptional() @IsString() currency?: string;
}

export class PaymentDto {
  @IsOptional() @IsNumber() amount?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() cardNumber?: string;
  @IsOptional() @IsString() cardHolder?: string;
  @IsOptional() @IsString() bankName?: string;
  @IsOptional() @IsNumber() installmentCount?: number;
  @IsOptional() @IsString() finalizedDate?: string;
  @IsOptional() @IsString() paymentId?: string;
}

export class CreateReservationDto {
  @IsString() @IsNotEmpty() bookingCode: string;

  @IsOptional()
  @IsString()
  @IsIn(['CONFIRMED', 'CANCELLED', 'PENDING', 'PAYMENT_FAILED'])
  status?: string;

  @IsOptional() @IsString() @IsIn(['flight', 'bus', 'hotel', 'car'])
  type?: string;

  @IsOptional() @ValidateNested() @Type(() => FlightDto)
  flight?: FlightDto;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => FlightDto)
  flightLegs?: FlightDto[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => PassengerDto)
  passengers?: PassengerDto[];

  @IsOptional() @ValidateNested() @Type(() => PaymentDto)
  payment?: PaymentDto;

  @IsOptional() @IsString() shoppingFileId?: string;
  @IsOptional() @IsNumber() totalFare?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() correlationId?: string;

  /** Ödeme / finalize başarısız olduğunda kısa açıklama */
  @IsOptional() @IsString() failureReason?: string;

  /** İletişim kişisi e-posta — onay maili bu adrese gönderilir */
  @IsOptional() @IsString() @MaxLength(256) contactEmail?: string;

  /** İletişim kişisi adı (mail selamlama için) */
  @IsOptional() @IsString() @MaxLength(128) contactName?: string;
}
