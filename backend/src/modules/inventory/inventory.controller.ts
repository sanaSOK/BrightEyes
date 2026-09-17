import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateSkuDto } from './dto/create-sku.dto';
import { UpdateSkuDto } from './dto/update-sku.dto';
import { CatalogFilterDto } from './dto/catalog-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../database/enums';

@ApiTags('Inventory (Catalog)')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('catalog')
  @ApiOperation({
    summary: 'Browse live optical SKU catalog with filters and pagination',
    description: 'Filter by SPH/CYL/AXIS ranges, SKU type, in-stock status, and supplier',
  })
  getCatalog(@Query() filter: CatalogFilterDto) {
    return this.inventoryService.getCatalog(filter);
  }

  @Get('skus/:sku')
  @ApiOperation({ summary: 'Get details for a specific SKU' })
  findOne(@Param('sku') sku: string) {
    return this.inventoryService.findOne(sku);
  }

  @Post('skus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new SKU in supplier catalog (Supplier/Admin only)' })
  @ApiResponse({ status: 201, description: 'SKU created' })
  createSku(@Body() dto: CreateSkuDto, @GetUser() user: UserContext) {
    return this.inventoryService.createSku(dto, user);
  }

  @Put('skus/:sku')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update SKU details or stock level (Supplier/Admin only)' })
  updateSku(
    @Param('sku') sku: string,
    @Body() dto: UpdateSkuDto,
    @GetUser() user: UserContext,
  ) {
    return this.inventoryService.updateSku(sku, dto, user);
  }
}
