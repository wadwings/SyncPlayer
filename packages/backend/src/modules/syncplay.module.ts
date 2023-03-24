import { Module } from '@nestjs/common';

import { WSGateway } from '@gateways/websocket.gateway';
import { SyncPlayService } from 'src/services/syncplay.service';

@Module({
  providers: [WSGateway, SyncPlayService],
})
export class WebsocketModule {}
