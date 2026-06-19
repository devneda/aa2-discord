import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MessagesGateway } from './messages.gateway';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('channels/:channelId/messages')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Enviar un mensaje a un canal' })
  async create(
    @Param('channelId') channelId: string,
    @Body() dto: CreateMessageDto,
    @CurrentUser() user: any,
  ) {
    const message = await this.messagesService.create(+channelId, dto, user.sub);
    this.messagesGateway.broadcastMessage(+channelId, message);
    return message;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener el historial de mensajes de un canal' })
  findByChannel(@Param('channelId') channelId: string) {
    return this.messagesService.findByChannel(+channelId);
  }
}
