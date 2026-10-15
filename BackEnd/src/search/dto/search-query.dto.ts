import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiPropertyOptional({ description: 'Free-text search' })
  @IsOptional() @IsString() keyword?: string;

  @ApiPropertyOptional({ description: 'Brand name filter' })
  @IsOptional() @IsString() brand?: string;

  @ApiPropertyOptional({ description: 'Model name filter' })
  @IsOptional() @IsString() model?: string;

  @ApiPropertyOptional({ description: 'Generation code filter' })
  @IsOptional() @IsString() generation?: string;

  @ApiPropertyOptional({ description: 'Body type filter' })
  @IsOptional() @IsString() bodyType?: string;

  @ApiPropertyOptional({ description: 'Fuel type filter' })
  @IsOptional() @IsString() fuelType?: string;

  @ApiPropertyOptional({ description: 'Country of origin filter' })
  @IsOptional() @IsString() country?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() yearMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() yearMax?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() priceMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() priceMax?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() hpMin?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sortDir?: 'asc' | 'desc';

  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}
