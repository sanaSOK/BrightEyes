import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpVerification } from '../../database/entities';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OtpVerification])],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
