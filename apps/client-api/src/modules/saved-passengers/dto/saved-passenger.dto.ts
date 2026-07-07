import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateSavedPassengerDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  label?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  lastName: string;

  /** YYYY-MM-DD */
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'birthDate YYYY-MM-DD formatında olmalı' })
  birthDate: string;

  @IsEnum(['M', 'F'])
  gender: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  nationality: string;

  @IsEnum(['ADT', 'CHD', 'INF'])
  paxType: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  tcNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  passportNumber?: string;

  /** YYYY-MM-DD */
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'passportExpiry YYYY-MM-DD formatında olmalı' })
  passportExpiry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}

export class UpdateSavedPassengerDto extends CreateSavedPassengerDto {}
