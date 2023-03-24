import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
// import * as cookieParser from 'cookie-parser';
import { WsAdapter } from '@nestjs/platform-ws';
import * as http from 'http';

// somewhere in your initialization file

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // await app.use(cookieParser());
  app.useWebSocketAdapter(
    new WsAdapter(http.createServer(app.getHttpServer())),
  );

  // app.enableCors({
  //   origin: 'http://localhost:5173',
  //   credentials: true,
  // });
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
