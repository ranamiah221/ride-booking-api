import { IsIn, IsNotEmpty } from 'class-validator';
import { RideStatus } from 'generated/prisma';


export class UpdateStatusDto {
  @IsNotEmpty()
  @IsIn(['accepted','driver_enroute','picked_up','in_transit','completed','cancelled'])
  status: RideStatus;
}
