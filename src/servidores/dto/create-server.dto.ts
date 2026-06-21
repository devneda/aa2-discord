import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServerDto {
  @ApiProperty({ example: 'Mi Servidor de Gaming' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Servidor para jugar a Minecraft y charlar', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
