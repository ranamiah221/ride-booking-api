import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RidesService {
  constructor(private prisma: PrismaService) {}

  // create locations and ride
  async requestRide(riderId: string, dto: any) {
    // create pickup location
    const pickup = await this.prisma.location.create({
      data: {
        address: dto.pickupAddress,
        latitude: dto.pickupLat ?? 0,
        longitude: dto.pickupLng ?? 0,
        name: dto.pickupAddress,
      },
    });

    const dropoff = await this.prisma.location.create({
      data: {
        address: dto.dropoffAddress,
        latitude: dto.dropoffLat ?? 0,
        longitude: dto.dropoffLng ?? 0,
        name: dto.dropoffAddress,
      },
    });

    const ride = await this.prisma.ride.create({
      data: {
        riderId,
        pickupLocationId: pickup.id,
        dropoffLocationId: dropoff.id,
        pickupAddress: dto.pickupAddress,
        dropoffAddress: dto.dropoffAddress,
        status: 'REQUESTED',
      },
    });

    // log initial history
    await this.prisma.rideStatusHistory.create({
      data: {
        rideId: ride.id,
        status: 'REQUESTED',
        note: 'Ride requested by rider',
        changedBy: riderId,
      },
    });

    return ride;
  }

  async cancelRide(riderId: string, rideId: string) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');
    if (ride.riderId !== riderId) throw new ForbiddenException('Not your ride');

    // Allow cancellation only in requested or accepted within short window — simplified: allow when not completed
    if (ride.status === 'COMPLETED' || ride.status === 'CANCELLED') {
      throw new BadRequestException('Cannot cancel ride at this stage');
    }

    const updated = await this.prisma.ride.update({
      where: { id: rideId },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });

    await this.prisma.rideCancellation.create({
      data: {
        rideId,
        cancelledBy: riderId,
        reason: 'Cancelled by rider',
        refundable: true,
      },
    });

    await this.prisma.rideStatusHistory.create({
      data: {
        rideId,
        status: 'CANCELLED',
        changedBy: riderId,
        note: 'Cancelled by rider',
      },
    });

    return updated;
  }

  async acceptRide(driverId: string, rideId: string) {
    // fetch driver state
    const driver = await this.prisma.driver.findUnique({ where: { userId: driverId } });
    if (!driver) throw new NotFoundException('Driver profile not found');
    if (driver.approvalStatus !== 'APPROVED') throw new ForbiddenException('Driver not approved');
    if (driver.onRide) throw new ForbiddenException('Driver currently on another ride');

    // attempt to assign if requested
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');
    if (ride.status !== 'REQUESTED') throw new BadRequestException('Ride not available for accept');

    // transaction: set ride driver, set acceptedAt, set driver.onRide
    const updated = await this.prisma.$transaction(async (tx) => {
      const r = await tx.ride.update({
        where: { id: rideId },
        data: {
          driverId,
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      });

      await tx.driver.update({
        where: { userId: driverId },
        data: { onRide: true },
      });

      await tx.rideStatusHistory.create({
        data: {
          rideId,
          status: 'ACCEPTED',
          changedBy: driverId,
          note: 'Driver accepted the ride',
        },
      });

      return r;
    });

    return updated;
  }

  async updateStatus(driverId: string, rideId: string, status: any) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');
    if (ride.driverId !== driverId) throw new ForbiddenException('Not your assigned ride');

    // allowed transitions logic minimal (can be expanded)
    const allowed = ['driver_enroute', 'picked_up', 'in_transit', 'completed', 'cancelled'];
    if (!allowed.includes(status)) throw new BadRequestException('Invalid status');

    const data: any = { status };
    if (status === 'picked_up') data.startedAt = new Date();
    if (status === 'completed') {
      data.completedAt = new Date();
    }
    if (status === 'cancelled') {
      data.cancelledAt = new Date();
    }

    const updated = await this.prisma.ride.update({
      where: { id: rideId },
      data,
    });

    await this.prisma.rideStatusHistory.create({
      data: {
        rideId,
        status,
        changedBy: driverId,
        note: `Driver set status to ${status}`,
      },
    });

    // if completed or cancelled, free driver
    if (status === 'completed' || status === 'cancelled') {
      await this.prisma.driver.update({
        where: { userId: driverId },
        data: { onRide: false },
      });
    }

    return updated;
  }

  async riderHistory(riderId: string) {
    return this.prisma.ride.findMany({
      where: { riderId },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async driverHistory(driverId: string) {
    return this.prisma.ride.findMany({
      where: { driverId },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async getRide(rideId: string) {
    return this.prisma.ride.findUnique({ where: { id: rideId } });
  }
  
}
