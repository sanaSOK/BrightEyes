import { IsOptional, IsUUID, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryLensMatrixDto {
  @IsUUID()
  @IsOptional()
  lensProductId?: string;

  @IsString()
  @IsOptional()
  brandName?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sph?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  cyl?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  axis?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  addPower?: number;
}
