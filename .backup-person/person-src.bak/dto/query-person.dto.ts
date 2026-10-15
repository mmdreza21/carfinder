import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPersonDto {
    @ApiPropertyOptional({ description: 'Keyword match on name, summary, or job title' })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiPropertyOptional({ description: 'Filter by exact skill' })
    @IsOptional()
    @IsString()
    skill?: string;

    @ApiPropertyOptional({ description: 'Filter by job title (partial match)' })
    @IsOptional()
    @IsString()
    jobTitle?: string;

    @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Results per page', default: 20, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;
}