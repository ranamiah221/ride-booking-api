import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRideDto {
  @IsNotEmpty()
  pickupAddress: string;

  @IsNotEmpty()
  dropoffAddress: string;

  // For simplicity we'll create Location on the fly; otherwise pass locationId
  @IsOptional()
  pickupLat?: number;

  @IsOptional()
  pickupLng?: number;

  @IsOptional()
  dropoffLat?: number;

  @IsOptional()
  dropoffLng?: number;
}
