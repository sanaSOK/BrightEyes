import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({ example: 'LENS-SPH-2.00-CYL-1.00-AX90', description: 'SKU string' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 10, description: 'Quantity to add to cart (greater than 0)' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
