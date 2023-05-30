import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(cookieParser());
  app.enableCors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  if (process.env.NODE_ENV === 'production') {
    // const output = execSync('npx prisma migrate deploy');
    // console.log(output.toString());
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
