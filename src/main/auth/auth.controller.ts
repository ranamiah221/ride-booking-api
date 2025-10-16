import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { handleRequest } from 'src/common/util/request.handle';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return handleRequest(
      () => this.authService.register(dto.email, dto.password, dto.role, dto.fullName, dto.phone),
       'User created successfully'
      );
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return handleRequest(() => this.authService.login(dto.email, dto.password), "User Login Successfully")

  }
}

