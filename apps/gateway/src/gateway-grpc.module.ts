import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
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
        transport: Transport.GRPC,
        options: {
          package: "customer",
          protoPath: join(__dirname, "../../../proto/customer.proto"),
          url: `${process.env.CUSTOMER_GRPC_HOST || "localhost"}:${process.env.CUSTOMER_GRPC_PORT || 5001}`,
          maxSendMessageLength: 1024 * 1024 * 4, // 4MB
          maxReceiveMessageLength: 1024 * 1024 * 4, // 4MB
          keepalive: {
            keepaliveTimeMs: 30000,
            keepaliveTimeoutMs: 5000,
            keepalivePermitWithoutCalls: 1,
            http2MaxPingsWithoutData: 0,
            http2MinTimeBetweenPingsMs: 10000,
            http2MinPingIntervalWithoutDataMs: 300000,
          },
          // TLS/SSL Configuration
          credentials:
            process.env.GRPC_TLS === "true"
              ? undefined
              : require("@grpc/grpc-js").credentials.createInsecure(),
        },
      },
      {
        name: "PRODUCTS_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "products",
          protoPath: join(__dirname, "../../../proto/products.proto"),
          url: `${process.env.PRODUCTS_GRPC_HOST || "localhost"}:${process.env.PRODUCTS_GRPC_PORT || 5002}`,
          maxSendMessageLength: 1024 * 1024 * 4,
          maxReceiveMessageLength: 1024 * 1024 * 4,
        },
      },
      {
        name: "SHOPPING_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "shopping",
          protoPath: join(__dirname, "../../../proto/shopping.proto"),
          url: `${process.env.SHOPPING_GRPC_HOST || "localhost"}:${process.env.SHOPPING_GRPC_PORT || 5003}`,
          maxSendMessageLength: 1024 * 1024 * 4,
          maxReceiveMessageLength: 1024 * 1024 * 4,
        },
      },
      {
        name: "AUTH_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "auth",
          protoPath: join(__dirname, "../../../proto/auth.proto"),
          url: `${process.env.AUTH_GRPC_HOST || "localhost"}:${process.env.AUTH_GRPC_PORT || 5004}`,
          maxSendMessageLength: 1024 * 1024 * 4,
          maxReceiveMessageLength: 1024 * 1024 * 4,
          // Multiple proto files example
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
          },
          // Advanced gRPC options
          channelOptions: {
            "grpc.keepalive_time_ms": 30000,
            "grpc.keepalive_timeout_ms": 5000,
            "grpc.keepalive_permit_without_calls": true,
            "grpc.http2.max_pings_without_data": 0,
            "grpc.http2.min_time_between_pings_ms": 10000,
            "grpc.http2.min_ping_interval_without_data_ms": 300000,
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
export class GatewayGrpcModule {}
