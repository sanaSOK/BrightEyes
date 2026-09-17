import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RetailInventoryService } from './retail-inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from '../../database/enums';

@ApiTags('Retail Inventory')
@Controller('retail-inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RetailInventoryController {
  constructor(private readonly retailInventoryService: RetailInventoryService) {}

  @Get()
  @Roles(UserRole.RETAILER, UserRole.ADMIN)
  @ApiOperation({ summary: 'View current synced inventory for authenticated retail shop' })
  getMyInventory(@GetUser() user: UserContext) {
    return this.retailInventoryService.getMyInventory(user);
  }
}
