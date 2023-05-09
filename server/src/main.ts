import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('process.env.MONGO_URL', process.env.MONGO_URL);

  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  // app.enableCors({ origin: '*', credentials: true });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(parseInt(process.env.PORT) || 8000);
}
bootstrap();
