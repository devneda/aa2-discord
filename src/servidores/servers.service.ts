import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { UsersService } from '../usuarios/users.service';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private readonly serversRepository: Repository<Server>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateServerDto, userId: number): Promise<Server> {
    const owner = await this.usersService.findOne(userId);
    const server = this.serversRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      owner,
    });
    const saved = await this.serversRepository.save(server);
    delete saved.owner.password;
    return saved;
  }

  async findAll(): Promise<Server[]> {
    return this.serversRepository.find({
      relations: { owner: true },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        creadoEn: true,
        owner: {
          id: true,
          nombre: true,
          email: true,
          creadoEn: true,
        },
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Server> {
    const server = await this.serversRepository.findOne({
      where: { id },
      relations: { owner: true, channels: true },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        creadoEn: true,
        owner: {
          id: true,
          nombre: true,
          email: true,
          creadoEn: true,
        },
        channels: {
          id: true,
          nombre: true,
          tipo: true,
          creadoEn: true,
        },
      },
    });
    if (!server) {
      throw new NotFoundException(`Servidor con id ${id} no encontrado`);
    }
    return server;
  }

  async update(id: number, dto: UpdateServerDto, userId: number): Promise<Server> {
    const server = await this.findOne(id);
    if (server.owner.id !== userId) {
      throw new ForbiddenException('No tienes permisos para modificar este servidor');
    }
    await this.serversRepository.update(id, {
      nombre: dto.nombre ?? server.nombre,
      descripcion: dto.descripcion ?? server.descripcion,
    });
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const server = await this.findOne(id);
    if (server.owner.id !== userId) {
      throw new ForbiddenException('No tienes permisos para eliminar este servidor');
    }
    await this.serversRepository.delete(id);
  }
}
