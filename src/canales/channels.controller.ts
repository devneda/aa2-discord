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
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('canales')
@Controller()
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('servidores/:serverId/canales')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un canal en un servidor (solo propietario)' })
  create(
    @Param('serverId') serverId: string,
    @Body() dto: CreateChannelDto,
    @CurrentUser() user: any,
  ) {
    return this.channelsService.create(+serverId, dto, user.sub);
  }

  @Get('servidores/:serverId/canales')
  @ApiOperation({ summary: 'Obtener canales de un servidor' })
  findByServer(@Param('serverId') serverId: string) {
    return this.channelsService.findByServer(+serverId);
  }

  @Get('canales/:id')
  @ApiOperation({ summary: 'Obtener un canal por id' })
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(+id);
  }

  @Patch('canales/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un canal (solo propietario del servidor)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChannelDto,
    @CurrentUser() user: any,
  ) {
    return this.channelsService.update(+id, dto, user.sub);
  }

  @Delete('canales/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un canal (solo propietario del servidor)' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.channelsService.remove(+id, user.sub);
  }
}
