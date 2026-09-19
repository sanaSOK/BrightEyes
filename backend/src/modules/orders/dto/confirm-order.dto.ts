import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DeliveryMethod, PaymentTerms } from '../../../database/enums';

export class ConfirmOrderDto {
  @ApiProperty({
    enum: DeliveryMethod,
    example: DeliveryMethod.CARGO_24H,
    required: false,
    description: 'Tiered delivery method (cargo_24h, express_moto, self_pickup)',
  })
  @IsEnum(DeliveryMethod)
  @IsOptional()
  deliveryMethod?: DeliveryMethod;

  @ApiProperty({
    enum: PaymentTerms,
    example: PaymentTerms.IMMEDIATE,
    required: false,
    description: 'Payment terms (immediate, credit)',
  })
  @IsEnum(PaymentTerms)
  @IsOptional()
  paymentTerms?: PaymentTerms;

  @ApiProperty({
    example: 'IDEMP-9928374-1234',
    required: false,
    description: 'Idempotency key (can also be passed in Idempotency-Key header)',
  })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}
