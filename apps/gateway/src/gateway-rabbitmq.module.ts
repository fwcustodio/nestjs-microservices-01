import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CustomerController } from "./controllers/customer.controller";
import { ProductsController } from "./controllers/products.controller";
import { ShoppingController } from "./controllers/shopping.controller";
import { AuthController } from "./controllers/auth.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: "CUSTOMER_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
          queue: "customer_queue",
          queueOptions: {
            durable: true,
            arguments: {
              "x-message-ttl": 60000, // Message TTL: 60 seconds
              "x-expires": 300000, // Queue expires after 5 minutes of inactivity
              "x-max-length": 1000, // Maximum queue length
              "x-overflow": "reject-publish", // Behavior when max length reached
            },
          },
          socketOptions: {
            heartbeatIntervalInSeconds: 60,
            reconnectTimeInSeconds: 5,
          },
          prefetchCount: 10,
          isGlobalPrefetchCount: false,
          noAck: false,
        },
      },
      {
        name: "PRODUCTS_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
          queue: "products_queue",
          queueOptions: {
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: {
              "x-message-ttl": 120000, // 2 minutes TTL for products
              "x-max-priority": 10, // Priority queue
            },
          },
          socketOptions: {
            heartbeatIntervalInSeconds: 60,
            reconnectTimeInSeconds: 5,
          },
          prefetchCount: 20,
        },
      },
      {
        name: "SHOPPING_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
          queue: "shopping_queue",
          queueOptions: {
            durable: true,
            arguments: {
              "x-message-ttl": 180000, // 3 minutes TTL for shopping operations
              "x-dead-letter-exchange": "shopping_dlx",
              "x-dead-letter-routing-key": "shopping.failed",
            },
          },
          socketOptions: {
            heartbeatIntervalInSeconds: 60,
            reconnectTimeInSeconds: 5,
          },
          prefetchCount: 15,
        },
      },
      {
        name: "AUTH_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || "amqp://localhost:5672",
            // Multiple URLs for cluster setup
            "amqp://localhost:5673",
            "amqp://localhost:5674",
          ],
          queue: "auth_queue",
          queueOptions: {
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: {
              "x-message-ttl": 30000, // 30 seconds TTL for auth (security)
              "x-max-priority": 255, // High priority for auth operations
              "x-dead-letter-exchange": "auth_dlx",
              "x-dead-letter-routing-key": "auth.failed",
            },
          },
          socketOptions: {
            heartbeatIntervalInSeconds: 30, // More frequent heartbeat for auth
            reconnectTimeInSeconds: 2, // Faster reconnect for auth
            clientProperties: {
              connection_name: "auth-service-client",
            },
          },
          prefetchCount: 5, // Lower prefetch for auth operations
          isGlobalPrefetchCount: false,
          noAck: false,
          // Exchange configuration
          // exchange: 'auth_exchange',
          // exchangeType: 'topic',
          // routingKey: 'auth.*',
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
export class GatewayRabbitMQModule {}
