import { Module } from '@nestjs/common';
import { MainModule } from './main/main.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({
      isGlobal: true, // 👈 makes ConfigService available everywhere
    }), MainModule],
})
export class AppModule {}

