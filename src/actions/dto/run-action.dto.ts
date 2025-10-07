import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';

class ScopeDto {
  @ApiProperty({
    example: 'folder',
    description: 'Type of scope (either folder or files)',
    enum: ['folder', 'files'],
  })
  @IsString()
  type: 'folder' | 'files';

  @ApiProperty({
    example: 'Project Reports',
    description: 'Optional name of the folder (required if type = folder)',
    required: false,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    example: ['65123a7d9e1234567890abcd', '65123a7d9e9876543210dcba'],
    description: 'List of file IDs (required if type = files)',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  ids?: string[];
}

class MessageDto {
  @ApiProperty({
    example: 'user',
    description: 'Role of the message sender (user or assistant)',
  })
  @IsString()
  role: string;

  @ApiProperty({
    example: 'Summarize all reports in this folder.',
    description: 'Content of the message',
  })
  @IsString()
  content: string;
}

export class RunActionDto {
  @ApiProperty({
    description: 'Defines the scope of the action (folder or files)',
    type: () => ScopeDto,
    example: {
      type: 'folder',
      name: 'Project Reports',
      ids: ['65123a7d9e1234567890abcd'],
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ScopeDto)
  scope: ScopeDto;

  @ApiProperty({
    description: 'List of messages representing user-assistant dialogue',
    type: [MessageDto],
    example: [
      {
        role: 'user',
        content: 'Summarize all reports in this folder.',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];

  @ApiProperty({
    description: 'List of actions to perform',
    example: ['make_document', 'make_csv'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  actions: string[];
}
