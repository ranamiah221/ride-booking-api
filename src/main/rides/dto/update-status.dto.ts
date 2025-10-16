import { RideStatus } from '@prisma/client';
import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    example: RideStatus.ACCEPTED,
    description: 'New status of the ride',
    enum: [RideStatus],
  })
  @IsNotEmpty()
  @IsIn([RideStatus])
  status: RideStatus;
}

