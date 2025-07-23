# NestJS Microservices E-commerce Platform

A scalable e-commerce platform built with NestJS microservices architecture, MongoDB, and AWS services.

## Architecture

The platform consists of 5 main services:

- **API Gateway** (Port 3000) - Routes requests to microservices
- **Auth Service** (Port 3004) - User authentication and authorization
- **Customer Service** (Port 3001) - Customer management
- **Products Service** (Port 3002) - Product catalog management
- **Shopping Service** (Port 3003) - Cart and order management

Each service has its own MongoDB database for complete data isolation.

## Prerequisites

- Node.js 22+
- Docker and Docker Compose
- MongoDB (for local development)
- AWS Account (optional, for S3, SNS, SES services)

## Quick Start

### Development Mode

1. Install dependencies:

```bash
npm install
```

2. Copy and configure environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB instances (if not using Docker):

```bash
# Customer service database
mongod --port 27018 --dbpath ./data/customer

# Products service database
mongod --port 27019 --dbpath ./data/products

# Shopping service database
mongod --port 27020 --dbpath ./data/shopping

# Auth service database
mongod --port 27021 --dbpath ./data/auth
```

4. Start all services:

```bash
# Build the project
npm run build

# Start all services in parallel
npm run start:auth &
npm run start:customer &
npm run start:products &
npm run start:shopping &
npm run start:gateway
```

### Using Docker Compose

1. Build and start all services:

```bash
docker-compose up --build
```

2. Stop all services:

```bash
docker-compose down
```

## API Endpoints

### Authentication (`/auth`)

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (authenticated)
- `PUT /auth/change-password` - Change password (authenticated)
- `POST /auth/refresh` - Refresh JWT token (authenticated)
- `POST /auth/logout` - Logout user (authenticated)

### Customers (`/customers`)

- `POST /customers` - Create customer (authenticated)
- `GET /customers` - Get all customers (authenticated)
- `GET /customers/:id` - Get customer by ID (authenticated)
- `GET /customers/email/:email` - Get customer by email (authenticated)
- `PATCH /customers/:id` - Update customer (authenticated)
- `DELETE /customers/:id` - Delete customer (authenticated)

### Products (`/products`)

- `POST /products` - Create product (authenticated)
- `GET /products` - Get all products (public)
- `GET /products/search?q=term` - Search products (public)
- `GET /products/category/:category` - Get products by category (public)
- `GET /products/:id` - Get product by ID (public)
- `PATCH /products/:id` - Update product (authenticated)
- `PATCH /products/:id/stock` - Update product stock (authenticated)
- `DELETE /products/:id` - Delete product (authenticated)

### Shopping (`/shopping`)

- `POST /shopping/cart` - Add item to cart (authenticated)
- `GET /shopping/cart/:customerId` - Get customer's cart (authenticated)
- `PATCH /shopping/cart` - Update cart item quantity (authenticated)
- `DELETE /shopping/cart/:customerId/:productId` - Remove item from cart (authenticated)
- `DELETE /shopping/cart/:customerId` - Clear cart (authenticated)
- `POST /shopping/orders` - Create order (authenticated)
- `GET /shopping/orders/:customerId` - Get customer's orders (authenticated)
- `GET /shopping/order/:orderId` - Get order details (authenticated)
- `PATCH /shopping/order/:orderId/status` - Update order status (authenticated)
- `DELETE /shopping/order/:orderId` - Cancel order (authenticated)

## Environment Variables

### Database Configuration

```env
CUSTOMER_DB_URI=mongodb://localhost:27017/customer-service
PRODUCTS_DB_URI=mongodb://localhost:27017/products-service
SHOPPING_DB_URI=mongodb://localhost:27017/shopping-service
AUTH_DB_URI=mongodb://localhost:27017/auth-service
```

### JWT Configuration

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=3600
```

### Service Ports

```env
GATEWAY_PORT=3000
CUSTOMER_PORT=3001
PRODUCTS_PORT=3002
SHOPPING_PORT=3003
AUTH_PORT=3004
```

### AWS Configuration (Optional)

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name
AWS_SNS_TOPIC_ARN=your-sns-topic-arn
AWS_SES_FROM_EMAIL=noreply@yourdomain.com
```

## AWS Services Integration

The platform includes AWS service integration for:

- **S3**: File storage for product images
- **SNS**: Push notifications for order updates
- **SES**: Email notifications for users

## Development Commands

```bash
# Install dependencies
npm install

# Build all services
npm run build

# Start services in development mode
npm run start:dev

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
nest-microservices-ecommerce/
├── apps/
│   ├── gateway/          # API Gateway service
│   ├── auth/             # Authentication service
│   ├── customer/         # Customer management service
│   ├── products/         # Product catalog service
│   └── shopping/         # Shopping cart & orders service
├── libs/
│   └── shared/           # Shared libraries and utilities
├── docker-compose.yml    # Docker services configuration
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables
```

## Data Models

### User (Auth Service)

- firstName, lastName, email, password
- role (customer, admin, vendor)
- isActive, emailVerified
- phone, lastLogin

### Customer (Customer Service)

- firstName, lastName, email, phone
- address (street, city, state, zipCode, country)

### Product (Products Service)

- name, description, price, category
- stock, images, specifications
- isActive, rating, reviewCount

### Cart (Shopping Service)

- customerId, items[]
- items: { productId, quantity }

### Order (Shopping Service)

- customerId, items[], total, status
- shippingAddress, payment
- status: pending, confirmed, processing, shipped, delivered, cancelled

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
