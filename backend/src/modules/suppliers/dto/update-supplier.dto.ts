import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSupplierDto {
  @ApiProperty({ example: 'OptiVision Wholesale Ltd.', required: false })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty({ example: 'VAT-10928374', required: false })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiProperty({ example: 'Building 45, Monivong Blvd, Phnom Penh', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Phnom Penh', required: false })
  @IsString()
  @IsOptional()
  province?: string;
}
