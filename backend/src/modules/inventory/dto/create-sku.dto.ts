import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SkuType } from '../../../database/enums';
import { Type } from 'class-transformer';

export class CreateSkuDto {
  @ApiProperty({ example: 'LENS-SPH-2.00-CYL-1.00-AX90', description: 'Unique SKU identifier' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ enum: SkuType, example: SkuType.LENS })
  @IsEnum(SkuType)
  type: SkuType;

  @ApiProperty({ example: 'Single Vision Anti-Reflective Lens (-2.00/-1.00 x 90)' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 100, default: 0 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stockLevel: number;

  @ApiProperty({ example: -2.0, required: false, description: 'Sphere power SPH (-20.00 to +20.00)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sph?: number;

  @ApiProperty({ example: -1.0, required: false, description: 'Cylinder power CYL (-10.00 to +10.00)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  cyl?: number;

  @ApiProperty({ example: 90, required: false, description: 'Axis (1 to 180 degrees)' })
  @IsInt()
  @Min(1)
  @Max(180)
  @IsOptional()
  @Type(() => Number)
  axis?: number;

  @ApiProperty({ example: 20, default: 20, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  lowStockThreshold?: number;
}
