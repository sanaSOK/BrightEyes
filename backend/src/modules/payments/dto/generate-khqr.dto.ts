import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class GenerateKhqrDto {
  @ApiProperty({ description: 'Order ID' })
  @IsUUID()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ description: 'Invoice ID' })
  @IsUUID()
  @IsOptional()
  invoiceId?: string;

  @ApiProperty({ example: 45.0, description: 'Amount in USD' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'USD', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;
}

export class KhqrWebhookDto {
  @ApiProperty({ example: 'd41d8cd98f00b204e9800998ecf8427e', description: 'MD5 hash of Bakong KHQR transaction' })
  @IsString()
  md5: string;

  @ApiProperty({ example: 'SUCCESS' })
  @IsString()
  status: string;

  @ApiProperty({ example: 45.0 })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;
}
