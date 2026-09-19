import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LensProduct, LensVariant, B2bInventory } from '../../database/entities';
import { CreateLensProductDto } from './dto/create-lens-product.dto';
import { CreateLensVariantDto } from './dto/create-lens-variant.dto';
import { QueryLensMatrixDto } from './dto/query-lens-matrix.dto';

@Injectable()
export class LensMatrixService {
  constructor(
    @InjectRepository(LensProduct)
    private readonly productRepository: Repository<LensProduct>,
    @InjectRepository(LensVariant)
    private readonly variantRepository: Repository<LensVariant>,
    @InjectRepository(B2bInventory)
    private readonly b2bInventoryRepository: Repository<B2bInventory>,
  ) {}

  async createProduct(dto: CreateLensProductDto): Promise<LensProduct> {
    const product = this.productRepository.create(dto);
    return await this.productRepository.save(product);
  }

  async findAllProducts(): Promise<LensProduct[]> {
    return await this.productRepository.find({ relations: ['variants'] });
  }

  async findProductById(id: string): Promise<LensProduct> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['variants'],
    });
    if (!product) {
      throw new NotFoundException(`Lens product with ID ${id} not found`);
    }
    return product;
  }

  async createVariant(dto: CreateLensVariantDto): Promise<LensVariant> {
    const existing = await this.variantRepository.findOne({ where: { sku: dto.sku } });
    if (existing) {
      throw new ConflictException(`Lens variant with SKU ${dto.sku} already exists`);
    }

    const variant = this.variantRepository.create(dto);
    return await this.variantRepository.save(variant);
  }

  // Optimized Matrix Lookup using composite index idx_lens_matrix (lens_product_id, sph, cyl)
  async queryMatrix(query: QueryLensMatrixDto): Promise<LensVariant[]> {
    const qb = this.variantRepository
      .createQueryBuilder('variant')
      .leftJoinAndSelect('variant.lensProduct', 'product')
      .leftJoinAndSelect('variant.b2bInventories', 'b2bInventory')
      .leftJoinAndSelect('b2bInventory.supplier', 'supplier');

    if (query.lensProductId) {
      qb.andWhere('variant.lensProductId = :lensProductId', { lensProductId: query.lensProductId });
    }

    if (query.brandName) {
      qb.andWhere('product.brandName ILIKE :brandName', { brandName: `%${query.brandName}%` });
    }

    if (query.sph !== undefined) {
      qb.andWhere('variant.sph = :sph', { sph: query.sph });
    }

    if (query.cyl !== undefined) {
      qb.andWhere('variant.cyl = :cyl', { cyl: query.cyl });
    }

    if (query.axis !== undefined) {
      qb.andWhere('variant.axis = :axis', { axis: query.axis });
    }

    if (query.addPower !== undefined) {
      qb.andWhere('variant.addPower = :addPower', { addPower: query.addPower });
    }

    return await qb.getMany();
  }

  async findVariantBySku(sku: string): Promise<LensVariant> {
    const variant = await this.variantRepository.findOne({
      where: { sku },
      relations: ['lensProduct', 'b2bInventories', 'b2bInventories.supplier'],
    });
    if (!variant) {
      throw new NotFoundException(`Lens variant SKU ${sku} not found`);
    }
    return variant;
  }
}
