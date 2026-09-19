import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerPrescription, User } from '../../database/entities';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(CustomerPrescription)
    private readonly prescriptionRepository: Repository<CustomerPrescription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreatePrescriptionDto, userCtx: UserContext): Promise<CustomerPrescription> {
    const customer = await this.userRepository.findOne({ where: { id: dto.customerId } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${dto.customerId} not found`);
    }

    const prescription = this.prescriptionRepository.create({
      ...dto,
      storeId: userCtx.shopId || undefined,
    });

    return await this.prescriptionRepository.save(prescription);
  }

  async findByCustomer(customerId: string): Promise<CustomerPrescription[]> {
    return await this.prescriptionRepository.find({
      where: { customerId },
      relations: ['store'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CustomerPrescription> {
    const rx = await this.prescriptionRepository.findOne({
      where: { id },
      relations: ['store', 'customer'],
    });
    if (!rx) {
      throw new NotFoundException(`Prescription ${id} not found`);
    }
    return rx;
  }
}
