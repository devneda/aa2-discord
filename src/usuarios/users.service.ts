import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find({ order: { id: 'ASC' } });
    return users.map(user => {
      delete user.password;
      return user;
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    delete user.password;
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        nombre: true,
        email: true,
        password: true,
        creadoEn: true,
      },
    });
  }

  async create(data: Partial<User>): Promise<User> {
    try {
      const user = this.usersRepository.create(data);
      const savedUser = await this.usersRepository.save(user);
      const result = { ...savedUser };
      delete result.password;
      return result;
    } catch (error) {
      if (error.message?.includes('UNIQUE constraint failed') || error.code === '23505') {
        throw new ConflictException('El email ya está registrado');
      }
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    await this.usersRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.delete(id);
  }
}
