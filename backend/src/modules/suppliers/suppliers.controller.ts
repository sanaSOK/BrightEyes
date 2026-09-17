import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../database/enums';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOperation({ summary: 'List all registered suppliers' })
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier profile by ID' })
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update supplier profile (Supplier/Admin only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
    @GetUser() user: UserContext,
  ) {
    return this.suppliersService.update(id, dto, user);
  }
}
