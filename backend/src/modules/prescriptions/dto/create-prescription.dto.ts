import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty({ description: 'Customer User ID' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Optometrist / Eye Specialist name' })
  @IsString()
  @IsOptional()
  checkedBy?: string;

  // Oculus Dexter (OD) - Right Eye
  @ApiProperty({ example: -2.25, description: 'OD Sphere' })
  @IsNumber()
  odSph: number;

  @ApiProperty({ example: -1.0, description: 'OD Cylinder' })
  @IsNumber()
  @IsOptional()
  odCyl?: number;

  @ApiProperty({ example: 90, description: 'OD Axis (1-180)' })
  @IsNumber()
  @IsOptional()
  odAxis?: number;

  @ApiProperty({ example: 1.5, description: 'OD Addition' })
  @IsNumber()
  @IsOptional()
  odAdd?: number;

  @ApiProperty({ example: 31.5, description: 'OD Pupillary Distance (PD)' })
  @IsNumber()
  @IsOptional()
  odPd?: number;

  // Oculus Sinister (OS) - Left Eye
  @ApiProperty({ example: -2.0, description: 'OS Sphere' })
  @IsNumber()
  osSph: number;

  @ApiProperty({ example: -0.75, description: 'OS Cylinder' })
  @IsNumber()
  @IsOptional()
  osCyl?: number;

  @ApiProperty({ example: 180, description: 'OS Axis (1-180)' })
  @IsNumber()
  @IsOptional()
  osAxis?: number;

  @ApiProperty({ example: 1.5, description: 'OS Addition' })
  @IsNumber()
  @IsOptional()
  osAdd?: number;

  @ApiProperty({ example: 31.5, description: 'OS Pupillary Distance (PD)' })
  @IsNumber()
  @IsOptional()
  osPd?: number;

  @ApiProperty({ example: 8.6, description: 'Base Curve (BC)' })
  @IsNumber()
  @IsOptional()
  baseCurve?: number;

  @ApiProperty({ example: 'Patient complains of night glare' })
  @IsString()
  @IsOptional()
  notes?: string;
}
