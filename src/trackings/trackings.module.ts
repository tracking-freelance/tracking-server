import { Module } from '@nestjs/common';
import { TrackingsService } from './trackings.service';
import { TrackingsController } from './trackings.controller';
import { UsersModule } from 'src/users/users.module';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  imports: [UsersModule, SessionsModule],
  controllers: [TrackingsController],
  providers: [TrackingsService],
})
export class TrackingsModule {}
