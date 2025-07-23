# NestJS Microservices Transport Examples

Este projeto demonstra diferentes tipos de transporte para comunicação entre microserviços no NestJS. Cada módulo gateway implementa um tipo diferente de transporte para fins de estudo.

## Módulos Disponíveis

### 1. TCP Transport (Original)
**Arquivo:** `gateway.module.ts`
- **Uso:** Comunicação direta TCP entre serviços
- **Características:** Baixa latência, conexão direta
- **Ideal para:** Comunicação interna, alta performance

### 2. Kafka Transport
**Arquivo:** `gateway-kafka.module.ts`
- **Uso:** Message streaming platform
- **Características:** Alta throughput, particionamento, retenção de mensagens
- **Ideal para:** Event streaming, logs distribuídos, high-volume messaging

**Configuração Docker para Kafka:**
```yaml
kafka:
  image: confluentinc/cp-kafka:latest
  environment:
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
  ports:
    - "9092:9092"
```

### 3. Redis Transport
**Arquivo:** `gateway-redis.module.ts`
- **Uso:** In-memory data structure store como message broker
- **Características:** Rápido, suporte a pub/sub, persistência opcional
- **Ideal para:** Caching, session management, real-time messaging

**Features implementadas:**
- Diferentes databases Redis por serviço
- Key prefix para organização
- Configurações de retry e timeout
- Lazy connection

### 4. NATS Transport
**Arquivo:** `gateway-nats.module.ts`
- **Uso:** Cloud-native messaging system
- **Características:** Lightweight, high-performance, subject-based routing
- **Ideal para:** Cloud-native applications, IoT, edge computing

**Features implementadas:**
- Clustering com múltiplos servidores
- Queue groups para load balancing
- JetStream support
- Authentication e TLS

### 5. gRPC Transport
**Arquivo:** `gateway-grpc.module.ts`
- **Uso:** High-performance RPC framework
- **Características:** Binary protocol, strong typing, HTTP/2
- **Ideal para:** APIs internas, alta performance, type safety

**Requisitos adicionais:**
- Arquivos `.proto` em `/proto/`
- Protocol Buffers para definição de contratos
- Configurações de keepalive e SSL/TLS

### 6. RabbitMQ Transport
**Arquivo:** `gateway-rabbitmq.module.ts`
- **Uso:** Advanced Message Queuing Protocol (AMQP)
- **Características:** Routing flexível, durabilidade, clustering
- **Ideal para:** Enterprise messaging, complex routing, guaranteed delivery

**Features implementadas:**
- Dead Letter Exchanges (DLX)
- Message TTL e priority queues
- Clustering support
- Queue arguments avançados

### 7. MQTT Transport
**Arquivo:** `gateway-mqtt.module.ts`
- **Uso:** Lightweight messaging protocol para IoT
- **Características:** Publish/Subscribe, baixo overhead, QoS levels
- **Ideal para:** IoT devices, mobile applications, low bandwidth

**Features implementadas:**
- QoS levels (0, 1, 2)
- Will messages para status
- Persistent sessions
- TLS/SSL support

## Variáveis de Ambiente

Adicione ao seu `.env`:

```bash
# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_USERNAME=
KAFKA_PASSWORD=
KAFKA_SSL=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# NATS
NATS_URL=nats://localhost:4222
NATS_USER=
NATS_PASS=
NATS_TOKEN=
NATS_TLS=false
NATS_JETSTREAM=false

# gRPC
CUSTOMER_GRPC_HOST=localhost
CUSTOMER_GRPC_PORT=5001
PRODUCTS_GRPC_HOST=localhost
PRODUCTS_GRPC_PORT=5002
SHOPPING_GRPC_HOST=localhost
SHOPPING_GRPC_PORT=5003
AUTH_GRPC_HOST=localhost
AUTH_GRPC_PORT=5004
GRPC_TLS=false

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# MQTT
MQTT_URL=mqtt://localhost:1883
MQTT_USERNAME=
MQTT_PASSWORD=
MQTT_TLS=false
MQTT_CA_CERT=
MQTT_CLIENT_CERT=
MQTT_CLIENT_KEY=
MQTT_REJECT_UNAUTHORIZED=true
```

## Dependências Adicionais

As seguintes dependências foram adicionadas ao `package.json`:

```json
{
  "@grpc/grpc-js": "^1.9.0",
  "@grpc/proto-loader": "^0.7.10",
  "amqplib": "^0.10.3",
  "ioredis": "^5.3.2",
  "kafkajs": "^2.2.4",
  "nats": "^2.15.1"
}
```

## Como Testar Cada Transport

### 1. Para usar TCP (padrão):
```bash
npm run start:gateway
```

### 2. Para usar Kafka:
```bash
# Modifique main.ts para importar GatewayKafkaModule
npm run start:gateway
```

### 3. Para usar Redis:
```bash
# Modifique main.ts para importar GatewayRedisModule
npm run start:gateway
```

E assim por diante para cada transport.

## Considerações de Performance

| Transport | Latência | Throughput | Complexidade | Durabilidade |
|-----------|----------|------------|--------------|--------------|
| TCP       | Baixa    | Alta       | Baixa        | Não          |
| gRPC      | Baixa    | Alta       | Média        | Não          |
| Redis     | Baixa    | Alta       | Baixa        | Opcional     |
| NATS      | Baixa    | Muito Alta | Baixa        | Com JetStream|
| Kafka     | Média    | Muito Alta | Alta         | Sim          |
| RabbitMQ  | Média    | Alta       | Alta         | Sim          |
| MQTT      | Baixa    | Média      | Baixa        | Opcional     |

## Casos de Uso Recomendados

- **TCP/gRPC**: APIs internas, comunicação síncrona
- **Redis**: Cache distribuído, sessões, pub/sub simples
- **NATS**: Aplicações cloud-native, microserviços distribuídos
- **Kafka**: Event streaming, analytics, logs distribuídos
- **RabbitMQ**: Sistemas enterprise, routing complexo
- **MQTT**: IoT, dispositivos móveis, conexões instáveis