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

  // Phase 3 GPS Store Locator: Find nearby partner stores using Haversine formula
  async findNearby(lat: number, lng: number, radiusKm: number = 10) {
    const shops = await this.shopRepository.find();
    
    // Haversine distance calculation in kilometers
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const shopsWithDistance = shops
      .map((shop) => {
        if (!shop.latitude || !shop.longitude) return null;
        const dLat = toRad(Number(shop.latitude) - lat);
        const dLon = toRad(Number(shop.longitude) - lng);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat)) *
            Math.cos(toRad(Number(shop.latitude))) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = Math.round(R * c * 100) / 100;

        return {
          ...shop,
          distanceKm,
        };
      })
      .filter((s) => s !== null && s.distanceKm <= radiusKm)
      .sort((a, b) => a!.distanceKm - b!.distanceKm);

    return shopsWithDistance;
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
