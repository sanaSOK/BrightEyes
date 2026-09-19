import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@ApiTags('Clinical Prescriptions (POS & Customer Vault)')
@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new ophthalmic prescription record (OD/OS specs)' })
  create(@Body() dto: CreatePrescriptionDto, @GetUser() userCtx: UserContext) {
    return this.prescriptionsService.create(dto, userCtx);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get all prescriptions for a specific customer' })
  findByCustomer(@Param('customerId') customerId: string) {
    return this.prescriptionsService.findByCustomer(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription details by ID' })
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }
}
