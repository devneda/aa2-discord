import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('channels')
@Controller()
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('servers/:serverId/channels')
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

  @Get('servers/:serverId/channels')
  @ApiOperation({ summary: 'Obtener canales de un servidor' })
  findByServer(@Param('serverId') serverId: string) {
    return this.channelsService.findByServer(+serverId);
  }

  @Delete('channels/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un canal (solo propietario del servidor)' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.channelsService.remove(+id, user.sub);
  }
}
