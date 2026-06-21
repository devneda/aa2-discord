import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './server.entity';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { UsersModule } from '../usuarios/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Server]),
    UsersModule,
    AuthModule,
  ],
  providers: [ServersService],
  controllers: [ServersController],
  exports: [ServersService, TypeOrmModule],
})
export class ServersModule {}
