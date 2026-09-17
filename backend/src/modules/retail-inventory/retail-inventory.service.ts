import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetailInventory } from '../../database/entities';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../database/enums';

@Injectable()
export class RetailInventoryService {
  constructor(
    @InjectRepository(RetailInventory)
    private retailInventoryRepository: Repository<RetailInventory>,
  ) {}

  async getMyInventory(userCtx: UserContext) {
    if (userCtx.role !== UserRole.RETAILER && userCtx.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only retailers can view shop inventory');
    }
    if (!userCtx.shopId && userCtx.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Retail shop profile required');
    }

    return this.retailInventoryRepository.find({
      where: userCtx.role === UserRole.ADMIN ? {} : { shopId: userCtx.shopId },
      relations: { skuItem: true, shop: true },
      order: { updatedAt: 'DESC' },
    });
  }
}
