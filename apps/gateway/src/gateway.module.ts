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
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt(process.env.CUSTOMER_PORT) || 3001,
        },
      },
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt(process.env.PRODUCTS_PORT) || 3002,
        },
      },
      {
        name: 'SHOPPING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt(process.env.SHOPPING_PORT) || 3003,
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt(process.env.AUTH_PORT) || 3004,
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
export class GatewayModule {}