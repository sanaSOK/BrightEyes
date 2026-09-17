import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SkuType } from '../../../database/enums';
import { Type } from 'class-transformer';

export class UpdateSkuDto {
  @ApiProperty({ enum: SkuType, required: false })
  @IsEnum(SkuType)
  @IsOptional()
  type?: SkuType;

  @ApiProperty({ example: 'Updated Lens Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 18.0, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiProperty({ example: 150, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stockLevel?: number;

  @ApiProperty({ example: -2.5, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sph?: number;

  @ApiProperty({ example: -0.75, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  cyl?: number;

  @ApiProperty({ example: 180, required: false })
  @IsInt()
  @Min(1)
  @Max(180)
  @IsOptional()
  @Type(() => Number)
  axis?: number;

  @ApiProperty({ example: 25, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  lowStockThreshold?: number;
}
