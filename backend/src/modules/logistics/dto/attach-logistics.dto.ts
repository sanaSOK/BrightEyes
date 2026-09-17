import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DeliveryMethod } from '../../../database/enums';

export class AttachLogisticsDto {
  @ApiProperty({ example: 'order-uuid-1234' })
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ enum: DeliveryMethod, example: DeliveryMethod.CARGO_24H })
  @IsEnum(DeliveryMethod)
  method: DeliveryMethod;

  @ApiProperty({ example: 'VET-LOG-991823', required: false, description: 'Carrier tracking reference' })
  @IsString()
  @IsOptional()
  providerRef?: string;

  @ApiProperty({ example: 'in_transit', required: false, description: 'Status string (pending, in_transit, delivered)' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: '2026-09-15T18:00:00.000Z', required: false })
  @IsOptional()
  estimatedArrival?: Date;
}
