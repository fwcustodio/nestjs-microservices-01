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
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || "localhost",
          port: parseInt(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          db: parseInt(process.env.REDIS_DB) || 0,
          // retryDelayOnFailover: 100,
          retryAttempts: 5,
          maxRetriesPerRequest: 3,
          connectTimeout: 60000,
          lazyConnect: true,
          keepAlive: 30000,
        },
      },
      {
        name: "PRODUCTS_SERVICE",
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || "localhost",
          port: parseInt(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          db: parseInt(process.env.REDIS_DB) || 1,
          // retryDelayOnFailover: 100,
          retryAttempts: 5,
          maxRetriesPerRequest: 3,
          connectTimeout: 60000,
          lazyConnect: true,
          keyPrefix: "products:",
        },
      },
      {
        name: "SHOPPING_SERVICE",
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || "localhost",
          port: parseInt(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          db: parseInt(process.env.REDIS_DB) || 2,
          // retryDelayOnFailover: 100,
          retryAttempts: 5,
          maxRetriesPerRequest: 3,
          connectTimeout: 60000,
          lazyConnect: true,
          keyPrefix: "shopping:",
        },
      },
      {
        name: "AUTH_SERVICE",
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || "localhost",
          port: parseInt(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          db: parseInt(process.env.REDIS_DB) || 3,
          // retryDelayOnFailover: 100,
          retryAttempts: 5,
          maxRetriesPerRequest: 3,
          connectTimeout: 60000,
          lazyConnect: true,
          keyPrefix: "auth:",
          // Redis Cluster configuration (if using cluster)
          enableReadyCheck: false,
          // maxRetriesPerRequest: null,
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
export class GatewayRedisModule {}
