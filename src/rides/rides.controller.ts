import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RidesService } from './rides.service';
import { RolesGuard } from 'src/common/roles.guards';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Roles } from 'src/common/roles.decorators';


@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('rides')
export class RidesController {
  constructor(private ridesService: RidesService) {}

  // Rider requests a ride
  @Post()
  @Roles('rider')
  async requestRide(@Request() req: any, @Body() dto: CreateRideDto) {
    return this.ridesService.requestRide(req.user.userId, dto);
  }

  // Rider cancels
  @Post(':id/cancel')
  @Roles('rider')
  async cancel(@Request() req: any, @Param('id') id: string) {
    return this.ridesService.cancelRide(req.user.userId, id);
  }

  // Driver accepts a ride
  @Post(':id/accept')
  @Roles('driver')
  async accept(@Request() req: any, @Param('id') id: string) {
    return this.ridesService.acceptRide(req.user.userId, id);
  }

  // Driver updates status
  @Patch(':id/status')
  @Roles('driver')
  async updateStatus(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.ridesService.updateStatus(req.user.userId, id, dto.status);
  }

  // Rider ride history
  @Get('history/me')
  @Roles('rider')
  async riderHistory(@Request() req: any) {
    return this.ridesService.riderHistory(req.user.userId);
  }

  // Driver ride history
  @Get('history/driver/me')
  @Roles('driver')
  async driverHistory(@Request() req: any) {
    return this.ridesService.driverHistory(req.user.userId);
  }

  // Get ride detail (rider or driver)
  @Get(':id')
  @Roles('rider', 'driver', 'admin')
  async getRide(@Request() req: any, @Param('id') id: string) {
    const ride = await this.ridesService.getRide(id);
    return ride;
  }
}
