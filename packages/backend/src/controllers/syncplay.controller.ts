// import { Controller, Get, Put, Req, Res } from '@nestjs/common';
// import { SyncPlayService } from '../services/syncplay.service';
// import { Request, Response } from 'express';

// @Controller('sync')
// export class SyncPlayController {
//   constructor(private readonly syncPlayService: SyncPlayService) {}

//   @Get()
//   getHello(): string {
//     return this.syncPlayService.getHello();
//   }

//   @Put('status')
//   putStatus(@Req() request: Request, @Res() response: Response): Response {
//     const id = request.cookies['videoSyncId'];
//     const data = JSON.parse(request.setEncoding('utf-8').read());
//     console.log('request payload:', data);
//     const status: PlayStatus = data;
//     this.syncPlayService.setStatus(id, status);
//     response.status(200);
//     response.jsonp({ status: 'success', message: '' });
//     return response;
//   }

//   @Get('status')
//   getStatus(@Req() request: Request, @Res() response: Response): Response {
//     const id = request.cookies['videoSyncId'];
//     const data = this.syncPlayService.getStatus(id);
//     console.log(data);
//     if (data.valid) {
//       response.jsonp({ status: 'success', message: data });
//       return response;
//     } else {
//       response.status(404);
//       response.jsonp({
//         status: 'error',
//         message: 'No related play status found',
//       });
//       return response;
//     }
//   }
// }
