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
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL || 'mqtt://localhost:1883',
          clientId: 'customer-gateway-client',
          clean: true,
          connectTimeout: 4000,
          username: process.env.MQTT_USERNAME || undefined,
          password: process.env.MQTT_PASSWORD || undefined,
          reconnectPeriod: 1000,
          keepalive: 60,
          will: {
            topic: 'customer/gateway/status',
            payload: 'offline',
            qos: 1,
            retain: true,
          },
          // QoS levels: 0 = at most once, 1 = at least once, 2 = exactly once
          subscribeOptions: {
            qos: 1,
          },
          serializer: {
            serialize: (value: any) => Buffer.from(JSON.stringify(value)),
          },
          deserializer: {
            deserialize: (value: any) => JSON.parse(value.toString()),
          },
        },
      },
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL || 'mqtt://localhost:1883',
          clientId: 'products-gateway-client',
          clean: true,
          connectTimeout: 4000,
          username: process.env.MQTT_USERNAME || undefined,
          password: process.env.MQTT_PASSWORD || undefined,
          reconnectPeriod: 1000,
          keepalive: 60,
          subscribeOptions: {
            qos: 2, // Exactly once delivery for products
          },
        },
      },
      {
        name: 'SHOPPING_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL || 'mqtt://localhost:1883',
          clientId: 'shopping-gateway-client',
          clean: true,
          connectTimeout: 4000,
          username: process.env.MQTT_USERNAME || undefined,
          password: process.env.MQTT_PASSWORD || undefined,
          reconnectPeriod: 1000,
          keepalive: 60,
          subscribeOptions: {
            qos: 2, // Exactly once for shopping operations
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL || 'mqtt://localhost:1883',
          clientId: 'auth-gateway-client',
          clean: false, // Persistent session for auth
          connectTimeout: 4000,
          username: process.env.MQTT_USERNAME || undefined,
          password: process.env.MQTT_PASSWORD || undefined,
          reconnectPeriod: 500, // Faster reconnect for auth
          keepalive: 30, // More frequent keepalive for auth
          will: {
            topic: 'auth/gateway/status',
            payload: 'offline',
            qos: 2,
            retain: true,
          },
          subscribeOptions: {
            qos: 2, // Exactly once for auth operations
          },
          // TLS/SSL for secure auth communication
          protocol: process.env.MQTT_TLS === 'true' ? 'mqtts' : 'mqtt',
          ca: process.env.MQTT_CA_CERT || undefined,
          cert: process.env.MQTT_CLIENT_CERT || undefined,
          key: process.env.MQTT_CLIENT_KEY || undefined,
          rejectUnauthorized: process.env.MQTT_REJECT_UNAUTHORIZED === 'true',
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
export class GatewayMqttModule {}