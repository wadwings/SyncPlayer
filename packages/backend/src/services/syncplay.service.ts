import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
// import { type } from 'os';
import { stringify } from 'querystring';

const connectionState = (state: 'leader' | 'follower'): ConnectionType => {
  return {
    type: 'connection',
    state: state,
  };
};

const invalidPlayState = (): PlayStatus => {
  return {
    valid: false,
    isPaused: false,
    currentTime: 0,
    src: '',
  };
};

@Injectable()
export class SyncPlayService {
  sessionMap: Record<string, Array<WebSocket>>;
  clientMap: WeakMap<WebSocket, string>;

  constructor() {
    this.sessionMap = {};
    this.clientMap = new WeakMap();
  }

  connect(id: string, client: WebSocket): ConnectionType {
    if (!this.sessionMap[id] || this.sessionMap[id].length === 0) {
      this.sessionMap[id] = [client];
      this.clientMap.set(client, id);
      // console.log(this.sessionMap[id]);
      return connectionState('leader');
    } else {
      this.sessionMap[id].push(client);
      this.clientMap.set(client, id);
      // console.log(this.sessionMap[id]);
      return connectionState('follower');
    }
  }

  disconnect(client: WebSocket): void {
    const id = this.clientMap.get(client);
    if (this.sessionMap[id]) {
      if (this.sessionMap[id].length <= 1) {
        delete this.sessionMap[id];
      } else {
        this.sessionMap[id] = this.sessionMap[id].filter(
          (value) => value !== client,
        );
        this.sessionMap[id][0].send(JSON.stringify(connectionState('leader')));
      }
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  broadcast(id: string, t: PlayStatus): SyncType {
    // console.log(this.sessionMap[id]);
    if (!this.sessionMap[id]) {
      return {
        type: 'sync',
        playState: invalidPlayState(),
      };
    }
    this.sessionMap[id].forEach((client, index) => {
      if (index === 0) {
        return;
      }
      client.send(
        JSON.stringify({
          type: 'sync',
          playState: t,
        }),
      );
    });
  }
}
