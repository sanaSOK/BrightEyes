import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { SkuType } from '../../../database/enums';

export class CatalogFilterDto {
  @ApiProperty({ enum: SkuType, required: false, description: 'Filter by SKU type (lens, frame, accessory)' })
  @IsEnum(SkuType)
  @IsOptional()
  type?: SkuType;

  @ApiProperty({ example: 'supplier-uuid', required: false, description: 'Filter by specific supplier ID' })
  @IsString()
  @IsOptional()
  supplierId?: string;

  @ApiProperty({ example: -4.0, required: false, description: 'Minimum SPH power' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minSph?: number;

  @ApiProperty({ example: 0.0, required: false, description: 'Maximum SPH power' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxSph?: number;

  @ApiProperty({ example: -2.0, required: false, description: 'Minimum CYL power' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minCyl?: number;

  @ApiProperty({ example: 0.0, required: false, description: 'Maximum CYL power' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxCyl?: number;

  @ApiProperty({ example: 1, required: false, description: 'Minimum Axis degree (1-180)' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  minAxis?: number;

  @ApiProperty({ example: 180, required: false, description: 'Maximum Axis degree (1-180)' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  maxAxis?: number;

  @ApiProperty({ example: true, required: false, description: 'Filter only items with stock_level > 0' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  inStockOnly?: boolean;

  @ApiProperty({ example: 1, default: 1, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ example: 20, default: 20, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
