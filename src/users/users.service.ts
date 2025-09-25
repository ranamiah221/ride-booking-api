import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { email: string; password: string; role: 'rider' | 'driver' | 'admin'; fullName?: string; phone?: string }) {
    const hash = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hash,
        role: data.role,
        fullName: data.fullName,
        phone: data.phone,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createDriverProfile(userId: string) {
    return this.prisma.driver.create({
      data: { userId },
    });
  }

  async createRiderProfile(userId: string) {
    return this.prisma.rider.create({
      data: { userId },
    });
  }

  async listAllUsers() {
    return this.prisma.user.findMany();
  }

  async listDrivers() {
    return this.prisma.driver.findMany({ include: { user: true } });
  }
}
