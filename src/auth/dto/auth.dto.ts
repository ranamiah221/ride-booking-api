import { IsEmail, IsNotEmpty, MinLength, IsIn, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  fullName?: string;

  @IsOptional()
  phone?: string;

  // 'rider' or 'driver' (admin should be created manually / seed)
  @IsIn(['rider', 'driver'])
  role: 'rider' | 'driver';
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
