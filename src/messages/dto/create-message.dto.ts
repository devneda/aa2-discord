import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'Hola a todos!' })
  @IsString()
  @IsNotEmpty()
  contenido: string;
}
