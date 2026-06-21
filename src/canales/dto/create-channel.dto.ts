import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ example: 'general' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'text', default: 'text', required: false })
  @IsString()
  @IsOptional()
  tipo?: string;
}
