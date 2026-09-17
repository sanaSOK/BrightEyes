import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LogisticsService } from './logistics.service';
import { AttachLogisticsDto } from './dto/attach-logistics.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/enums';

@ApiTags('Logistics Tracking')
@Controller('logistics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post('attach')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Attach or update delivery method and carrier tracking info' })
  attachLogistics(@Body() dto: AttachLogisticsDto) {
    return this.logisticsService.attachLogistics(dto);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get logistics tracking status for an order' })
  getTrackingByOrderId(@Param('orderId') orderId: string) {
    return this.logisticsService.getTrackingByOrderId(orderId);
  }
}
