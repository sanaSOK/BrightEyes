import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../database/entities';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../database/enums';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async findAll() {
    return this.supplierRepository.find();
  }

  async findOne(id: string) {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto, userCtx: UserContext) {
    const supplier = await this.findOne(id);
    if (userCtx.role !== UserRole.ADMIN && supplier.userId !== userCtx.id) {
      throw new ForbiddenException('Suppliers can only modify their own profile');
    }
    Object.assign(supplier, dto);
    return this.supplierRepository.save(supplier);
  }
}
