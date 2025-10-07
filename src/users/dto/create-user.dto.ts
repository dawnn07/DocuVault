import { IsEmail, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(['admin', 'support', 'moderator', 'user'])
  @IsOptional()
  role?: string;
}
