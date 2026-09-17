import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRetailShopDto {
  @ApiProperty({ example: 'Phnom Penh Premium Optical', required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ example: '#123 Norodom Blvd, Phnom Penh', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Phnom Penh', required: false })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ example: 11.5564, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 104.9282, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}
