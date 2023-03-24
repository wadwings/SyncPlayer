import { Session } from '@fastify/secure-session';

declare global {
  interface FastifyRequest {
    session: Session;
  }
  interface PlayStatus {
    valid: boolean;
    isPaused: boolean;
    currentTime: number;
    src: string;
  }
  interface ConnectionType {
    type: 'connection';
    state: 'leader' | 'follower';
  }
  interface SyncType {
    type: 'sync';
    playState: PlayStatus;
  }
}
