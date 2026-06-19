import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServerDto {
  @ApiProperty({ example: 'Nuevo Nombre de Servidor', required: false })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiProperty({ example: 'Nueva descripción', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
