import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CustomerController } from './controllers/customer.controller';
import { ProductsController } from './controllers/products.controller';
import { ShoppingController } from './controllers/shopping.controller';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'CUSTOMER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'customer-client',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
            retry: {
              retries: 8,
            },
          },
          consumer: {
            groupId: 'customer-consumer',
            allowAutoTopicCreation: true,
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'products-client',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
            retry: {
              retries: 8,
            },
          },
          consumer: {
            groupId: 'products-consumer',
            allowAutoTopicCreation: true,
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
      {
        name: 'SHOPPING_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'shopping-client',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
            retry: {
              retries: 8,
            },
          },
          consumer: {
            groupId: 'shopping-consumer',
            allowAutoTopicCreation: true,
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth-client',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
            ssl: process.env.KAFKA_SSL === 'true',
            sasl: process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD ? {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME,
              password: process.env.KAFKA_PASSWORD,
            } : undefined,
            retry: {
              retries: 8,
            },
          },
          consumer: {
            groupId: 'auth-consumer',
            allowAutoTopicCreation: true,
          },
          producer: {
            allowAutoTopicCreation: true,
            maxInFlightRequests: 1,
            retry: {
              retries: 5,
            },
          },
        },
      },
    ]),
  ],
  controllers: [
    CustomerController,
    ProductsController,
    ShoppingController,
    AuthController,
  ],
})
export class GatewayKafkaModule {}