import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductsModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: parseInt(process.env.PRODUCTS_PORT) || 3002,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen();
  console.log('Products microservice is running on port', process.env.PRODUCTS_PORT || 3002);
}
bootstrap();