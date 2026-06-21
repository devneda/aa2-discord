import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('servidores')
@Controller('servidores')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo servidor' })
  create(@Body() dto: CreateServerDto, @CurrentUser() user: any) {
    return this.serversService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los servidores' })
  findAll() {
    return this.serversService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de un servidor por id' })
  findOne(@Param('id') id: string) {
    return this.serversService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un servidor (solo propietario)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateServerDto,
    @CurrentUser() user: any,
  ) {
    return this.serversService.update(+id, dto, user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un servidor (solo propietario)' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.serversService.remove(+id, user.sub);
  }
}
