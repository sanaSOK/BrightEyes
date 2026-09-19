import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, IsEnum } from 'class-validator';
import { JobCardStatus } from '../../../database/enums';

export class CreateJobCardDto {
  @ApiProperty({ description: 'Prescription ID' })
  @IsUUID()
  @IsOptional()
  prescriptionId?: string;

  @ApiProperty({ description: 'Order ID' })
  @IsUUID()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ example: 'Essilor Crizal Sapphire HR (-2.25/-1.00 x 90)' })
  @IsString()
  @IsOptional()
  lensDetails?: string;

  @ApiProperty({ example: 'Edging and mounting into Rimless Titanium frame' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateJobCardStatusDto {
  @ApiProperty({ enum: JobCardStatus, example: JobCardStatus.IN_PROCESS })
  @IsEnum(JobCardStatus)
  status: JobCardStatus;
}
