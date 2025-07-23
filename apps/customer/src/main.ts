import { NestFactory } from '@nestjs/core';
import { CustomerModule } from './customer.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CustomerModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: parseInt(process.env.CUSTOMER_PORT) || 3001,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen();
  console.log('Customer microservice is running on port', process.env.CUSTOMER_PORT || 3001);
}
bootstrap();