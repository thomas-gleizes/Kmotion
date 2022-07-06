import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, payload: any): string {
    console.log('Message received: ', client.id, payload);

    return 'Hello world!';
  }
}
