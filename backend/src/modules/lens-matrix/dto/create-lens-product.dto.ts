import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLensProductDto {
  @IsString()
  @IsNotEmpty()
  brandName: string;

  @IsString()
  @IsNotEmpty()
  lensType: string;

  @IsString()
  @IsNotEmpty()
  lensMaterial: string;

  @IsString()
  @IsOptional()
  coating?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
