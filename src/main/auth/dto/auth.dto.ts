import { IsEmail, IsNotEmpty, MinLength, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'rider@gmail.com',
    description: 'Unique email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    minLength: 6,
    description: 'Password must be at least 6 characters long',
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    required: false,
  })
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    example: '+8801712345678',
    description: 'Phone number of the user',
    required: false,
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'rider',
    description: 'Role of the user (admin should be created manually)',
    enum: ['rider', 'driver'],
  })
  @IsIn(['rider', 'driver'])
  role: 'rider' | 'driver';
}

export class LoginDto {
  @ApiProperty({
    example: 'rider@gmail.com',
    description: 'Registered email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password',
  })
  @IsNotEmpty()
  password: string;
}

