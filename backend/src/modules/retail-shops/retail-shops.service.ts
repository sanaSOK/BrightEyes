import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetailShop } from '../../database/entities';
import { UpdateRetailShopDto } from './dto/update-retail-shop.dto';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../database/enums';

@Injectable()
export class RetailShopsService {
  constructor(
    @InjectRepository(RetailShop)
    private shopRepository: Repository<RetailShop>,
  ) {}

  async findAll() {
    return this.shopRepository.find();
  }

  async findOne(id: string) {
    const shop = await this.shopRepository.findOne({ where: { id } });
    if (!shop) {
      throw new NotFoundException(`Retail shop with ID ${id} not found`);
    }
    return shop;
  }

  async update(id: string, dto: UpdateRetailShopDto, userCtx: UserContext) {
    const shop = await this.findOne(id);
    if (userCtx.role !== UserRole.ADMIN && shop.userId !== userCtx.id) {
      throw new ForbiddenException('Retailers can only modify their own shop profile');
    }
    Object.assign(shop, dto);
    return this.shopRepository.save(shop);
  }
}
