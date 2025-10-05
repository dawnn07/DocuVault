import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password must be at least 6 characters long',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
