import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RidesService } from './rides.service';
import { RolesGuard } from 'src/common/guard/roles.guards';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Roles } from 'src/common/decorator/roles.decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get.user.decorators';
import { handleRequest } from 'src/common/util/request.handle';

@ApiTags("Rides")
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
@Controller('rides')
export class RidesController {
  constructor(private ridesService: RidesService) { }

  // Rider requests a ride
   @ApiOperation({ summary: "Protected Route For (Rider)" })
  @Post()
  @Roles(UserRole.RIDER)
  async requestRide(@GetUser('id') userId: string, @Body() dto: CreateRideDto) {
    return handleRequest(
      () => this.ridesService.requestRide(userId, dto),
      'Request ride successfully'
    );
  }

  // Rider cancels
   @ApiOperation({ summary: "Protected Route For (Rider)" })
  @Post(':id/cancel')
  @Roles(UserRole.RIDER)
  async cancel(@GetUser('id') userId: string, @Param('id') id: string) {
    return handleRequest(
      () => this.ridesService.cancelRide(userId, id),
      'Ride cancel successfully'
    );
  }

  // Driver accepts a ride
  @ApiOperation({ summary: "Protected Route For (Driver)" })
  @Post(':id/accept')
  @Roles(UserRole.DRIVER)
  async accept(@GetUser('id') userId: string, @Param('id') id: string) {
    return handleRequest(
      () => this.ridesService.acceptRide(userId, id),
      'Ride accept successfully'
    );
  }

  // Driver updates status
  @ApiOperation({ summary: "Protected Route For (Driver)" })
  @Patch(':id/status')
  @Roles(UserRole.DRIVER)
  async updateStatus(@GetUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return handleRequest(
      () => this.ridesService.updateStatus(userId, id, dto.status),
      'Change Ride status successfully'
    );
  }

  // Rider ride history
   @ApiOperation({ summary: "Protected Route For (Rider)" })
  @Get('history/me')
  @Roles(UserRole.RIDER)
  async riderHistory(@GetUser('id') userId: string) {
    return handleRequest(
      () => this.ridesService.riderHistory(userId),
      'Get Ride history successfully'
    );
  }

  // Driver ride history
   @ApiOperation({ summary: "Protected Route For (Driver)" })
  @Get('history/driver/me')
  @Roles(UserRole.DRIVER)
  async driverHistory(@GetUser('id') userId: string) {
     return handleRequest(
      () => this.ridesService.driverHistory(userId),
      'Get Driver history successfully'
    );
  }

  // Get ride detail (rider or driver)
  @Get(':id')
  @Roles(UserRole.RIDER , UserRole.DRIVER)
  async getRide(@GetUser('id') userId: string, @Param('id') id: string) {
     return handleRequest(
      () => this.ridesService.getRide(userId, id),
      'Get ride details successfully'
    );
  }
}
