import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Logger de nest para consola
  const logger = new Logger('Bootstrap');

  //Agrego prefijo global a mi rutas
  app.setGlobalPrefix('api');

  //Agrego validacion para los request de mis rutas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(AppModule.port);
  logger.log(`Server listener in port: ${AppModule.port}`);
}
bootstrap();
