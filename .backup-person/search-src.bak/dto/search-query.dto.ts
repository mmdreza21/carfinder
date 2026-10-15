import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
    @ApiPropertyOptional({
        description: 'Free-text keyword search across name, job title, company, summary and skills',
        example: 'recruiting manager',
    })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiPropertyOptional({
        description: 'Filter by an exact skill (case-insensitive)',
        example: 'leadership',
    })
    @IsOptional()
    @IsString()
    skill?: string;

    @ApiPropertyOptional({
        description: 'Filter by job title (partial match)',
        example: 'manager',
    })
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