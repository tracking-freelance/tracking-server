import { OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import cookie from 'cookie';
import { SessionsService } from 'src/sessions/sessions.service';

@WebSocketGateway(3001, {
  cors: {
    origin: process.env.ALLOW_ORIGINS
      ? process.env.ALLOW_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayDisconnect {
  constructor(private readonly sessionsService: SessionsService) {}

  handleDisconnect(client: any) {
    const cookies = cookie.parse(client.handshake.headers.cookie || '');
    if (cookies['session_id']) {
      this.sessionsService.end(cookies['session_id']);
    }
  }
}
