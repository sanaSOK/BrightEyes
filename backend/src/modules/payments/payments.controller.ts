import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { GenerateKhqrDto, KhqrWebhookDto } from './dto/generate-khqr.dto';

@ApiTags('Bakong KHQR Payments & Reconciliation')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('khqr/generate')
  @ApiOperation({ summary: 'Generate Bakong KHQR code for order/invoice' })
  generateKhqr(@Body() dto: GenerateKhqrDto) {
    return this.paymentsService.generateKhqr(dto);
  }

  @Post('khqr/webhook')
  @ApiOperation({ summary: 'Bakong KHQR instant payment reconciliation webhook callback' })
  processWebhook(@Body() dto: KhqrWebhookDto) {
    return this.paymentsService.processWebhook(dto);
  }

  @Get('khqr/:id')
  @ApiOperation({ summary: 'Check KHQR payment status' })
  getPaymentStatus(@Param('id') id: string) {
    return this.paymentsService.getPaymentStatus(id);
  }
}
