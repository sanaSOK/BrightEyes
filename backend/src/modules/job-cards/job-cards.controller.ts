import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { JobCardsService } from './job-cards.service';
import { CreateJobCardDto, UpdateJobCardStatusDto } from './dto/create-job-card.dto';

@ApiTags('POS Lab & Job Card Tracking')
@Controller('job-cards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JobCardsController {
  constructor(private readonly jobCardsService: JobCardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create lens-cutting & assembly job card (Received status)' })
  create(@Body() dto: CreateJobCardDto, @GetUser() userCtx: UserContext) {
    return this.jobCardsService.create(dto, userCtx);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of job cards for shop' })
  findAll(@GetUser() userCtx: UserContext) {
    return this.jobCardsService.findAll(userCtx);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job card status and details by ID' })
  findOne(@Param('id') id: string) {
    return this.jobCardsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update job card status (Received -> In-Process -> Ready)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateJobCardStatusDto,
    @GetUser() userCtx: UserContext,
  ) {
    return this.jobCardsService.updateStatus(id, dto, userCtx);
  }
}
