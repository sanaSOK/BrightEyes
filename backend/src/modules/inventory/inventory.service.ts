import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sku, Supplier } from '../../database/entities';
import { CreateSkuDto } from './dto/create-sku.dto';
import { UpdateSkuDto } from './dto/update-sku.dto';
import { CatalogFilterDto } from './dto/catalog-filter.dto';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../database/enums';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Sku)
    private skuRepository: Repository<Sku>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async getCatalog(filter: CatalogFilterDto) {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.skuRepository
      .createQueryBuilder('sku')
      .leftJoinAndSelect('sku.supplier', 'supplier');

    if (filter.type) {
      query.andWhere('sku.type = :type', { type: filter.type });
    }

    if (filter.supplierId) {
      query.andWhere('sku.supplierId = :supplierId', { supplierId: filter.supplierId });
    }

    if (filter.minSph !== undefined) {
      query.andWhere('sku.sph >= :minSph', { minSph: filter.minSph });
    }

    if (filter.maxSph !== undefined) {
      query.andWhere('sku.sph <= :maxSph', { maxSph: filter.maxSph });
    }

    if (filter.minCyl !== undefined) {
      query.andWhere('sku.cyl >= :minCyl', { minCyl: filter.minCyl });
    }

    if (filter.maxCyl !== undefined) {
      query.andWhere('sku.cyl <= :maxCyl', { maxCyl: filter.maxCyl });
    }

    if (filter.minAxis !== undefined) {
      query.andWhere('sku.axis >= :minAxis', { minAxis: filter.minAxis });
    }

    if (filter.maxAxis !== undefined) {
      query.andWhere('sku.axis <= :maxAxis', { maxAxis: filter.maxAxis });
    }

    if (filter.inStockOnly) {
      query.andWhere('sku.stockLevel > 0');
    }

    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(sku: string) {
    const item = await this.skuRepository.findOne({
      where: { sku },
      relations: { supplier: true },
    });
    if (!item) {
      throw new NotFoundException(`SKU ${sku} not found`);
    }
    return item;
  }

  async createSku(dto: CreateSkuDto, userCtx: UserContext) {
    if (userCtx.role !== UserRole.SUPPLIER && userCtx.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only suppliers can manage inventory SKUs');
    }

    if (!userCtx.supplierId && userCtx.role !== UserRole.ADMIN) {
      throw new BadRequestException('Supplier profile required before adding SKUs');
    }

    const existing = await this.skuRepository.findOne({ where: { sku: dto.sku } });
    if (existing) {
      throw new ConflictException(`SKU ${dto.sku} already exists`);
    }

    const skuEntity = this.skuRepository.create({
      ...dto,
      supplierId: userCtx.supplierId,
    });

    return this.skuRepository.save(skuEntity);
  }

  async updateSku(sku: string, dto: UpdateSkuDto, userCtx: UserContext) {
    const item = await this.findOne(sku);
    if (userCtx.role !== UserRole.ADMIN && item.supplierId !== userCtx.supplierId) {
      throw new ForbiddenException('Suppliers can only update their own SKUs');
    }

    Object.assign(item, dto);
    return this.skuRepository.save(item);
  }
}
