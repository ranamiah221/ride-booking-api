import { RideStatus } from '@prisma/client';
import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    example: 'accepted',
    description: 'New status of the ride',
    enum: ['accepted', 'driver_enroute', 'picked_up', 'in_transit', 'completed', 'cancelled'],
  })
  @IsNotEmpty()
  @IsIn(['accepted','driver_enroute','picked_up','in_transit','completed','cancelled'])
  status: RideStatus;
}

