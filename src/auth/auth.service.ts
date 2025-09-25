import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(email: string, password: string, role: 'rider' | 'driver', fullName?: string, phone?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Email already registered');

    const user = await this.usersService.createUser({
      email,
      password,
      role,
      fullName,
      phone,
    });

    // if driver role, create driver profile
    if (role === 'driver') {
      await this.usersService.createDriverProfile(user.id);
    } else {
      await this.usersService.createRiderProfile(user.id);
    }

    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return { access_token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } };
  }
}

