import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/enums';
import { LensMatrixService } from './lens-matrix.service';
import { CreateLensProductDto } from './dto/create-lens-product.dto';
import { CreateLensVariantDto } from './dto/create-lens-variant.dto';
import { QueryLensMatrixDto } from './dto/query-lens-matrix.dto';

@ApiTags('Lens Matrix (Catalog)')
@Controller('lens-matrix')
export class LensMatrixController {
  constructor(private readonly matrixService: LensMatrixService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get all lens products master catalog' })
  findAllProducts() {
    return this.matrixService.findAllProducts();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get lens product by ID with variants' })
  findProductById(@Param('id') id: string) {
    return this.matrixService.findProductById(id);
  }

  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new lens master product (Admin/Supplier)' })
  createProduct(@Body() dto: CreateLensProductDto) {
    return this.matrixService.createProduct(dto);
  }

  @Get('variants/query')
  @ApiOperation({ summary: 'Matrix-based query lookup for lens variants (Sph, Cyl, Axis, Add)' })
  queryMatrix(@Query() query: QueryLensMatrixDto) {
    return this.matrixService.queryMatrix(query);
  }

  @Get('variants/:sku')
  @ApiOperation({ summary: 'Get specific lens variant by SKU' })
  findVariantBySku(@Param('sku') sku: string) {
    return this.matrixService.findVariantBySku(sku);
  }

  @Post('variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create lens variant matrix entry (Admin/Supplier)' })
  createVariant(@Body() dto: CreateLensVariantDto) {
    return this.matrixService.createVariant(dto);
  }
}
