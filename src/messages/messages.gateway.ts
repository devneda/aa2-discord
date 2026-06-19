import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(client: Socket, channelId: number) {
    client.join(`channel_${channelId}`);
    console.log(`Cliente ${client.id} se unió al canal ${channelId}`);
    return { event: 'joined', data: channelId };
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(client: Socket, channelId: number) {
    client.leave(`channel_${channelId}`);
    console.log(`Cliente ${client.id} salió del canal ${channelId}`);
    return { event: 'left', data: channelId };
  }

  broadcastMessage(channelId: number, message: any) {
    this.server.to(`channel_${channelId}`).emit('message', message);
  }
}
