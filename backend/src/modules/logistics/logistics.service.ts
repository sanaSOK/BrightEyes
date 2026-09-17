import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogisticsTracking, Order } from '../../database/entities';
import { AttachLogisticsDto } from './dto/attach-logistics.dto';

@Injectable()
export class LogisticsService {
  constructor(
    @InjectRepository(LogisticsTracking)
    private logisticsRepository: Repository<LogisticsTracking>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async attachLogistics(dto: AttachLogisticsDto) {
    const order = await this.orderRepository.findOne({ where: { id: dto.orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${dto.orderId} not found`);
    }

    let tracking = await this.logisticsRepository.findOne({ where: { orderId: dto.orderId } });
    if (!tracking) {
      tracking = this.logisticsRepository.create({
        orderId: dto.orderId,
        method: dto.method,
        providerRef: dto.providerRef,
        status: dto.status || 'pending',
        estimatedArrival: dto.estimatedArrival,
      });
    } else {
      tracking.method = dto.method;
      if (dto.providerRef) tracking.providerRef = dto.providerRef;
      if (dto.status) tracking.status = dto.status;
      if (dto.estimatedArrival) tracking.estimatedArrival = dto.estimatedArrival;
    }

    const saved = await this.logisticsRepository.save(tracking);

    order.deliveryMethod = dto.method;
    await this.orderRepository.save(order);

    return saved;
  }

  async getTrackingByOrderId(orderId: string) {
    const tracking = await this.logisticsRepository.findOne({
      where: { orderId },
      relations: { order: true },
    });
    if (!tracking) {
      throw new NotFoundException(`No logistics tracking found for order ${orderId}`);
    }
    return tracking;
  }
}
