import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'optician@brighteyes.com', description: 'User email or phone' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'Secret123!', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
