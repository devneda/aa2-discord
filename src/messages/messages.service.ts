import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChannelsService } from '../canales/channels.service';
import { UsersService } from '../usuarios/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    channelId: number,
    dto: CreateMessageDto,
    userId: number,
  ): Promise<Message> {
    const channel = await this.channelsService.findOne(channelId);
    const sender = await this.usersService.findOne(userId);
    const message = this.messagesRepository.create({
      contenido: dto.contenido,
      channel,
      sender,
    });
    const saved = await this.messagesRepository.save(message);
    delete saved.sender.password;
    delete saved.channel;
    return saved;
  }

  async findByChannel(channelId: number): Promise<Message[]> {
    const channel = await this.channelsService.findOne(channelId);
    const messages = await this.messagesRepository.find({
      where: { channel: { id: channel.id } },
      relations: { sender: true },
      order: { creadoEn: 'ASC' },
    });
    return messages.map(msg => {
      delete msg.sender.password;
      return msg;
    });
  }
}
