import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  provider?: string;

  @IsOptional()
  providerId?: string;
}
