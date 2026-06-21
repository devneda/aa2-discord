import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './usuarios/users.module';
import { AuthModule } from './auth/auth.module';
import { ServersModule } from './servidores/servers.module';
import { ChannelsModule } from './canales/channels.module';
import { MessagesModule } from './messages/messages.module';
import { User } from './usuarios/user.entity';
import { Server } from './servidores/server.entity';
import { Channel } from './canales/channel.entity';
import { Message } from './messages/message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'discord',
      entities: [User, Server, Channel, Message],
      synchronize: true,
      logging: ['query', 'error'],
    }),
    UsersModule,
    AuthModule,
    ServersModule,
    ChannelsModule,
    MessagesModule,
  ],
})
export class AppModule {}
