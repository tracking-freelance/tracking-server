import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TrackingsModule } from './trackings/trackings.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TrackingsModule,
    UsersModule,
    PrismaModule,
    SessionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
