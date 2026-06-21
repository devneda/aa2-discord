import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../usuarios/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findOneByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      nombre: dto.nombre,
      email: dto.email,
      password: hashedPassword,
    });
    const payload = { sub: user.id, email: user.email, nombre: user.nombre };
    const token = await this.jwtService.signAsync(payload);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const payload = { sub: user.id, email: user.email, nombre: user.nombre };
    const token = await this.jwtService.signAsync(payload);
    const result = { ...user };
    delete result.password;
    return { user: result, token };
  }
}
