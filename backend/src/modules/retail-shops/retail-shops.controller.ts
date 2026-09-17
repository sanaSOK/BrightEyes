import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RetailShopsService } from './retail-shops.service';
import { UpdateRetailShopDto } from './dto/update-retail-shop.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../database/enums';

@ApiTags('Retail Shops')
@Controller('retail-shops')
export class RetailShopsController {
  constructor(private readonly retailShopsService: RetailShopsService) {}

  @Get()
  @ApiOperation({ summary: 'List all retail shops' })
  findAll() {
    return this.retailShopsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get retail shop profile by ID' })
  findOne(@Param('id') id: string) {
    return this.retailShopsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RETAILER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update retail shop profile (Retailer/Admin only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRetailShopDto,
    @GetUser() user: UserContext,
  ) {
    return this.retailShopsService.update(id, dto, user);
  }
}
