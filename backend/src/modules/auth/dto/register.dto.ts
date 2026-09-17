import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../database/enums';

export class RegisterDto {
  @ApiProperty({ example: 'optician@brighteyes.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+85512345678', description: 'User phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Secret123!', description: 'Password (min 6 chars)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.RETAILER, description: 'Role (supplier, retailer, admin)' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'Phnom Penh Optics', description: 'Company name for supplier or shop name for retailer', required: false })
  @IsString()
  @IsOptional()
  profileName?: string;
}
