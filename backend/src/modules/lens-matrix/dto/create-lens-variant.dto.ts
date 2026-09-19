import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min, Max } from 'class-validator';

export class CreateLensVariantDto {
  @IsUUID()
  @IsNotEmpty()
  lensProductId: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  sph: number;

  @IsNumber()
  @IsOptional()
  cyl?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(180)
  axis?: number;

  @IsNumber()
  @IsOptional()
  addPower?: number;

  @IsNumber()
  @IsOptional()
  baseCurve?: number;

  @IsNumber()
  @IsOptional()
  diameter?: number;
}
