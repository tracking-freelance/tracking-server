import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { RecordsModule } from 'src/records/records.module';

@Module({
  imports: [RecordsModule],
  providers: [SessionsService],
  exports: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
