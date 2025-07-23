#!/bin/bash

# Deploy script for NestJS Microservices E-commerce on AWS EKS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="ecommerce-microservices"
AWS_REGION="us-east-1"
ECR_REGISTRY="123456789012.dkr.ecr.us-east-1.amazonaws.com"
CLUSTER_NAME="ecommerce-cluster"

echo -e "${GREEN}🚀 Starting deployment of NestJS Microservices E-commerce Platform${NC}"

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
command -v kubectl >/dev/null 2>&1 || { echo -e "${RED}❌ kubectl is required but not installed${NC}"; exit 1; }
command -v aws >/dev/null 2>&1 || { echo -e "${RED}❌ AWS CLI is required but not installed${NC}"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker is required but not installed${NC}"; exit 1; }

# Check kubectl context
CURRENT_CONTEXT=$(kubectl config current-context)
echo -e "${GREEN}✅ Current kubectl context: $CURRENT_CONTEXT${NC}"

# Build and push Docker images
echo -e "${YELLOW}🐳 Building and pushing Docker images...${NC}"

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Build images
docker build -f apps/gateway/Dockerfile -t nestjs-ecommerce/gateway:latest .
docker build -f apps/auth/Dockerfile -t nestjs-ecommerce/auth-service:latest .
docker build -f apps/customer/Dockerfile -t nestjs-ecommerce/customer-service:latest .
docker build -f apps/products/Dockerfile -t nestjs-ecommerce/products-service:latest .
docker build -f apps/shopping/Dockerfile -t nestjs-ecommerce/shopping-service:latest .

# Tag and push images
docker tag nestjs-ecommerce/gateway:latest $ECR_REGISTRY/nestjs-ecommerce/gateway:latest
docker tag nestjs-ecommerce/auth-service:latest $ECR_REGISTRY/nestjs-ecommerce/auth-service:latest
docker tag nestjs-ecommerce/customer-service:latest $ECR_REGISTRY/nestjs-ecommerce/customer-service:latest
docker tag nestjs-ecommerce/products-service:latest $ECR_REGISTRY/nestjs-ecommerce/products-service:latest
docker tag nestjs-ecommerce/shopping-service:latest $ECR_REGISTRY/nestjs-ecommerce/shopping-service:latest

docker push $ECR_REGISTRY/nestjs-ecommerce/gateway:latest
docker push $ECR_REGISTRY/nestjs-ecommerce/auth-service:latest
docker push $ECR_REGISTRY/nestjs-ecommerce/customer-service:latest
docker push $ECR_REGISTRY/nestjs-ecommerce/products-service:latest
docker push $ECR_REGISTRY/nestjs-ecommerce/shopping-service:latest

echo -e "${GREEN}✅ Docker images built and pushed successfully${NC}"

# Create namespace
echo -e "${YELLOW}📦 Creating namespace...${NC}"
kubectl apply -f k8s/base/namespace.yaml

# Apply configurations
echo -e "${YELLOW}⚙️ Applying configurations...${NC}"
kubectl apply -k k8s/overlays/aws/

# Wait for MongoDB to be ready
echo -e "${YELLOW}⏳ Waiting for MongoDB instances to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=mongodb-auth -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l app=mongodb-customer -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l app=mongodb-products -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l app=mongodb-shopping -n $NAMESPACE --timeout=300s

# Wait for Redis to be ready
echo -e "${YELLOW}⏳ Waiting for Redis to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=redis -n $NAMESPACE --timeout=300s

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for microservices to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=auth-service -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l app=customer-service -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l app=products-service -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l app=shopping-service -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l app=gateway -n $NAMESPACE --timeout=300s

# Get service endpoints
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}📋 Service Information:${NC}"

GATEWAY_URL=$(kubectl get service gateway -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
if [ -n "$GATEWAY_URL" ]; then
    echo -e "${GREEN}🌐 Gateway URL: http://$GATEWAY_URL${NC}"
else
    echo -e "${YELLOW}⏳ Load balancer URL is being provisioned...${NC}"
    echo -e "${YELLOW}💡 Run: kubectl get service gateway -n $NAMESPACE${NC}"
fi

echo -e "${GREEN}📊 Pod Status:${NC}"
kubectl get pods -n $NAMESPACE

echo -e "${GREEN}🔗 Services:${NC}"
kubectl get services -n $NAMESPACE

echo -e "${GREEN}💾 Persistent Volumes:${NC}"
kubectl get pvc -n $NAMESPACE

echo -e "${GREEN}🎯 Next Steps:${NC}"
echo -e "${YELLOW}1. Update your DNS records to point to the load balancer${NC}"
echo -e "${YELLOW}2. Configure SSL certificates${NC}"
echo -e "${YELLOW}3. Set up monitoring and logging${NC}"
echo -e "${YELLOW}4. Configure AWS IAM roles for services${NC}"

echo -e "${GREEN}✨ Happy e-commerce! 🛒${NC}"