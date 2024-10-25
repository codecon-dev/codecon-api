import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { AuthMethod } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe'
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The password for the account',
    example: 'StrongP@ssw0rd'
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  @IsOptional()
  password?: string;

  @IsArray()
  @IsOptional()
  authMethods?: AuthMethod[];

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  providerId?: string;
}
