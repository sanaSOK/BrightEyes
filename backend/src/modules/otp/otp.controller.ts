import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { RequestOtpDto, VerifyOtpDto } from './dto/request-otp.dto';

@ApiTags('SMS OTP Gateway (Patient Data Vault Privacy)')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('request')
  @ApiOperation({ summary: 'Request SMS OTP for customer data authorization' })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.otpService.requestOtp(dto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify SMS OTP to unlock customer vision records' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto);
  }
}
