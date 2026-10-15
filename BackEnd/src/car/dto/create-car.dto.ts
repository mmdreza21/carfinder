import { IsInt, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateCarDto {
  @IsString() brandId!: string;
  @IsString() modelId!: string;
  @IsOptional() @IsString() generationId?: string;
  @IsString() fullName!: string;
  @IsInt() year!: number;
  @IsOptional() @IsString() trim?: string;
  @IsOptional() @IsString() bodyType?: string;
  @IsOptional() @IsString() fuelType?: string;
  @IsOptional() @IsInt() horsepower?: number;
  @IsOptional() @IsInt() priceUsd?: number;
  @IsOptional() @IsInt() mileageKm?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() zeroTo100Kmh?: number;
}
