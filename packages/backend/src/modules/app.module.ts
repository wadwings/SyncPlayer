import { Module } from '@nestjs/common';
// import { AppController } from '../controllers/app.controller';
import { WebsocketModule } from './syncplay.module';
// import { APP_ADAPTER } from '@nestjs/core';

@Module({
  imports: [WebsocketModule],
  controllers: [],
  providers: [],
  // providers: [{ provide: APP_ADAPTER, useClass: WsAdapter }],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   // consumer.apply(JwtMiddleware).forRoutes('sync');
  // }
}
