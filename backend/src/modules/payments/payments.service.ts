import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KhqrPayment, Order } from '../../database/entities';
import { PaymentStatus, OrderStatus } from '../../database/enums';
import { GenerateKhqrDto, KhqrWebhookDto } from './dto/generate-khqr.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(KhqrPayment)
    private readonly khqrRepository: Repository<KhqrPayment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async generateKhqr(dto: GenerateKhqrDto): Promise<KhqrPayment> {
    const md5Hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const mockQrString = `00020101021238580016A0000007700001010111123456785204599953038405405${dto.amount.toFixed(
      2,
    )}5802KH5918BrightEyes Optical6010Phnom Penh62170113KHQR${md5Hash.slice(0, 8)}6304ABCD`;

    const payment = this.khqrRepository.create({
      orderId: dto.orderId || undefined,
      invoiceId: dto.invoiceId || undefined,
      md5: md5Hash,
      qrString: mockQrString,
      amount: dto.amount,
      currency: dto.currency || 'USD',
      status: PaymentStatus.PENDING,
    });

    return await this.khqrRepository.save(payment);
  }

  // Webhook integration for instant Bakong KHQR payment reconciliation
  async processWebhook(dto: KhqrWebhookDto) {
    this.logger.log(`Received Bakong KHQR Webhook payload for MD5: ${dto.md5}`);

    const payment = await this.khqrRepository.findOne({ where: { md5: dto.md5 } });
    if (!payment) {
      throw new NotFoundException(`Bakong transaction with MD5 ${dto.md5} not found`);
    }

    if (dto.status === 'SUCCESS' || dto.status === 'SUCCESSFUL') {
      payment.status = PaymentStatus.COMPLETED;
      payment.reconciledAt = new Date();
      await this.khqrRepository.save(payment);

      if (payment.orderId) {
        const order = await this.orderRepository.findOne({ where: { id: payment.orderId } });
        if (order) {
          order.status = OrderStatus.CONFIRMED;
          await this.orderRepository.save(order);
        }
      }

      return {
        success: true,
        message: 'Payment successfully reconciled via Bakong Webhook',
        payment,
      };
    } else {
      payment.status = PaymentStatus.FAILED;
      await this.khqrRepository.save(payment);

      return {
        success: false,
        message: 'Payment marked as failed',
        payment,
      };
    }
  }

  async getPaymentStatus(id: string): Promise<KhqrPayment> {
    const payment = await this.khqrRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment record ${id} not found`);
    }
    return payment;
  }
}
