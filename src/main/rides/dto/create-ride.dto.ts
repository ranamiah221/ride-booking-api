import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRideDto {
  @ApiProperty({
    example: '123/A, Gulshan, Dhaka',
    description: 'Pickup address for the ride',
  })
  @IsNotEmpty()
  pickupAddress: string;

  @ApiProperty({
    example: '456/B, Dhanmondi, Dhaka',
    description: 'Dropoff address for the ride',
  })
  @IsNotEmpty()
  dropoffAddress: string;

  @ApiPropertyOptional({
    example: 23.7808875,
    description: 'Latitude of pickup location (optional)',
  })
  @IsOptional()
  pickupLat?: number;

  @ApiPropertyOptional({
    example: 90.2792371,
    description: 'Longitude of pickup location (optional)',
  })
  @IsOptional()
  pickupLng?: number;

  @ApiPropertyOptional({
    example: 23.745772,
    description: 'Latitude of dropoff location (optional)',
  })
  @IsOptional()
  dropoffLat?: number;

  @ApiPropertyOptional({
    example: 90.377867,
    description: 'Longitude of dropoff location (optional)',
  })
  @IsOptional()
  dropoffLng?: number;
}

