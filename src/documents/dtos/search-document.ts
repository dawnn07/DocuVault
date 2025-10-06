import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class SearchDocumentDto {
  @ApiProperty({
    description: 'Search keyword',
    example: 'project report',
  })
  @IsString()
  q: string;

  @ApiPropertyOptional({
    description: 'Search scope',
    enum: ['folder', 'files'],
    example: 'files',
  })
  @IsEnum(['folder', 'files'])
  @IsOptional()
  scope?: 'folder' | 'files';

  @ApiPropertyOptional({
    description: 'Filter by document IDs (comma separated or array)',
    example: ['65123a7d9e...', '65123a7d9f...'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return Array.isArray(value) ? value.map(String) : [];
  })
  ids?: string[];
}
