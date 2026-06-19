import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { ServersModule } from '../servers/servers.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    ServersModule,
    AuthModule,
  ],
  providers: [ChannelsService],
  controllers: [ChannelsController],
  exports: [ChannelsService, TypeOrmModule],
})
export class ChannelsModule {}
