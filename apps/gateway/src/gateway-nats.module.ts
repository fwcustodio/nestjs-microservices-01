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
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL || 'nats://localhost:4222'],
          maxReconnectAttempts: 10,
          reconnectTimeWait: 2000,
          timeout: 3000,
          pingInterval: 120000,
          maxPingOut: 2,
          preserveBuffers: false,
          // Authentication
          user: process.env.NATS_USER || undefined,
          pass: process.env.NATS_PASS || undefined,
          token: process.env.NATS_TOKEN || undefined,
          // TLS Configuration
          tls: process.env.NATS_TLS === 'true' ? {
            rejectUnauthorized: false,
          } : undefined,
          // Queue group for load balancing
          queue: 'customer-queue',
        },
      },
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL || 'nats://localhost:4222'],
          maxReconnectAttempts: 10,
          reconnectTimeWait: 2000,
          timeout: 3000,
          pingInterval: 120000,
          maxPingOut: 2,
          user: process.env.NATS_USER || undefined,
          pass: process.env.NATS_PASS || undefined,
          token: process.env.NATS_TOKEN || undefined,
          queue: 'products-queue',
        },
      },
      {
        name: 'SHOPPING_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL || 'nats://localhost:4222'],
          maxReconnectAttempts: 10,
          reconnectTimeWait: 2000,
          timeout: 3000,
          pingInterval: 120000,
          maxPingOut: 2,
          user: process.env.NATS_USER || undefined,
          pass: process.env.NATS_PASS || undefined,
          token: process.env.NATS_TOKEN || undefined,
          queue: 'shopping-queue',
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [
            process.env.NATS_URL || 'nats://localhost:4222',
            // Multiple servers for clustering
            'nats://localhost:4223',
            'nats://localhost:4224'
          ],
          maxReconnectAttempts: 10,
          reconnectTimeWait: 2000,
          timeout: 3000,
          pingInterval: 120000,
          maxPingOut: 2,
          user: process.env.NATS_USER || undefined,
          pass: process.env.NATS_PASS || undefined,
          token: process.env.NATS_TOKEN || undefined,
          queue: 'auth-queue',
          // Advanced NATS options
          verbose: false,
          pedantic: false,
          waitOnFirstConnect: true,
          ignoreClusterUpdates: false,
          // Jetstream configuration (if using NATS JetStream)
          jetstream: process.env.NATS_JETSTREAM === 'true',
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
export class GatewayNatsModule {}