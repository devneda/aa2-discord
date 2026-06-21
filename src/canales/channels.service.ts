import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ServersService } from '../servidores/servers.service';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    private readonly serversService: ServersService,
  ) {}

  async create(
    serverId: number,
    dto: CreateChannelDto,
    userId: number,
  ): Promise<Channel> {
    const server = await this.serversService.findOne(serverId);
    if (server.owner.id !== userId) {
      throw new ForbiddenException(
        'Solo el propietario del servidor puede crear canales',
      );
    }
    const channel = this.channelsRepository.create({
      nombre: dto.nombre,
      tipo: dto.tipo ?? 'text',
      server,
    });
    const saved = await this.channelsRepository.save(channel);
    delete saved.server;
    return saved;
  }

  async findByServer(serverId: number): Promise<Channel[]> {
    const server = await this.serversService.findOne(serverId);
    return this.channelsRepository.find({
      where: { server: { id: server.id } },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({
      where: { id },
      relations: { server: { owner: true } },
    });
    if (!channel) {
      throw new NotFoundException(`Canal con id ${id} no encontrado`);
    }
    return channel;
  }

  async update(id: number, dto: UpdateChannelDto, userId: number): Promise<Channel> {
    const channel = await this.findOne(id);
    if (!channel.server || channel.server.owner.id !== userId) {
      throw new ForbiddenException(
        'Solo el propietario del servidor puede actualizar canales',
      );
    }
    await this.channelsRepository.update(id, {
      nombre: dto.nombre ?? channel.nombre,
      tipo: dto.tipo ?? channel.tipo,
    });
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const channel = await this.findOne(id);
    if (!channel.server || channel.server.owner.id !== userId) {
      throw new ForbiddenException(
        'Solo el propietario del servidor puede eliminar canales',
      );
    }
    await this.channelsRepository.delete(id);
  }
}
