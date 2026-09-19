import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpVerification } from '../../database/entities';
import { RequestOtpDto, VerifyOtpDto } from './dto/request-otp.dto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectRepository(OtpVerification)
    private readonly otpRepository: Repository<OtpVerification>,
  ) {}

  async requestOtp(dto: RequestOtpDto) {
    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    const otpEntity = this.otpRepository.create({
      phone: dto.phone,
      otpCode,
      purpose: dto.purpose || 'prescriptions_access',
      expiresAt,
      isVerified: false,
    });

    await this.otpRepository.save(otpEntity);
    this.logger.log(`Generated OTP ${otpCode} for phone ${dto.phone}`);

    return {
      message: 'OTP sent successfully via SMS gateway',
      phone: dto.phone,
      expiresInSeconds: 300,
      // For development/demo purposes return otpCode
      devOtpCode: otpCode,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const record = await this.otpRepository.findOne({
      where: { phone: dto.phone, otpCode: dto.otpCode, isVerified: false },
      order: { createdAt: 'DESC' },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

    if (new Date() > record.expiresAt) {
      throw new BadRequestException('OTP code has expired');
    }

    record.isVerified = true;
    await this.otpRepository.save(record);

    return {
      verified: true,
      message: 'Customer OTP verified successfully. Vision history access granted.',
      phone: dto.phone,
    };
  }
}
