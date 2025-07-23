import { NestFactory } from '@nestjs/core';
import { ShoppingModule } from './shopping.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ShoppingModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: parseInt(process.env.SHOPPING_PORT) || 3003,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen();
  console.log('Shopping microservice is running on port', process.env.SHOPPING_PORT || 3003);
}
bootstrap();