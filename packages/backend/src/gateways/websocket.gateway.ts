import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Logger } from '@nestjs/common';
import { SyncPlayService } from 'src/services/syncplay.service';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
})
export class WSGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly syncPlayService: SyncPlayService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EchoGateway');

  handleConnection(client: WebSocket, ..._args: any[]) {
    this.logger.log(`Client connected: ${client}`);
  }

  handleDisconnect(client: WebSocket) {
    this.logger.log(`Client disconnected: ${client}`);
    this.syncPlayService.disconnect(client);
  }

  @SubscribeMessage('echo')
  findAll(@MessageBody() data: any): any {
    // console.log(data);
    return data;
  }

  @SubscribeMessage('connect')
  async identity12321(
    client: WebSocket,
    data: string,
  ): Promise<ConnectionType> {
    // console.log(data)
    const connectionState = this.syncPlayService.connect(data, client);
    return connectionState;
  }

  @SubscribeMessage('sync')
  async sync(@MessageBody() data: any): Promise<void> {
    // console.log(data);
    this.syncPlayService.broadcast(data.id, data.data);
    return;
  }
}
