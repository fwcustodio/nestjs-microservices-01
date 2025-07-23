# Kubernetes Deployment para AWS EKS

Este documento descreve como fazer deploy do sistema de microserviços NestJS E-commerce na AWS usando Kubernetes (EKS).

## 📋 Pré-requisitos

### Ferramentas Necessárias
- AWS CLI configurado
- kubectl instalado
- Docker instalado
- eksctl (opcional, para criar cluster)

### AWS Resources
- Cluster EKS
- ECR repositories para as imagens Docker
- IAM roles configuradas
- VPC com subnets públicas e privadas

## 🏗️ Estrutura dos Manifestos

```
k8s/
├── base/                          # Manifestos base
│   ├── namespace.yaml            # Namespace e resource quotas
│   ├── config.yaml               # ConfigMaps e Secrets
│   ├── mongodb.yaml              # StatefulSets do MongoDB
│   ├── redis.yaml                # Deployment do Redis
│   ├── auth-service.yaml         # Serviço de autenticação
│   ├── customer-service.yaml     # Serviço de clientes
│   ├── products-service.yaml     # Serviço de produtos
│   ├── shopping-service.yaml     # Serviço de compras
│   ├── gateway.yaml              # API Gateway
│   ├── ingress.yaml              # Ingress para AWS ALB
│   └── hpa.yaml                  # Horizontal Pod Autoscalers
├── overlays/
│   └── aws/                      # Configurações específicas da AWS
│       ├── kustomization.yaml    # Kustomize configuration
│       ├── storage-class.yaml    # Storage classes EBS
│       ├── gateway-patch.yaml    # Patches para o gateway
│       └── mongodb-patch.yaml    # Patches para MongoDB
└── deploy.sh                     # Script de deploy automatizado
```

## 🚀 Deploy Rápido

### 1. Preparar Environment

```bash
# Clone o repositório
git clone <repository-url>
cd nest-microservices-ecommerce

# Configure suas variáveis
export AWS_ACCOUNT_ID=123456789012
export AWS_REGION=us-east-1
export CLUSTER_NAME=ecommerce-cluster
```

### 2. Executar Deploy

```bash
# Executar script de deploy
./k8s/deploy.sh
```

## 📝 Deploy Manual Passo a Passo

### 1. Configurar ECR

```bash
# Criar repositories no ECR
aws ecr create-repository --repository-name nestjs-ecommerce/gateway
aws ecr create-repository --repository-name nestjs-ecommerce/auth-service
aws ecr create-repository --repository-name nestjs-ecommerce/customer-service
aws ecr create-repository --repository-name nestjs-ecommerce/products-service
aws ecr create-repository --repository-name nestjs-ecommerce/shopping-service
```

### 2. Build e Push das Imagens

```bash
# Login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build das imagens
docker build -f apps/gateway/Dockerfile -t nestjs-ecommerce/gateway:latest .
docker build -f apps/auth/Dockerfile -t nestjs-ecommerce/auth-service:latest .
docker build -f apps/customer/Dockerfile -t nestjs-ecommerce/customer-service:latest .
docker build -f apps/products/Dockerfile -t nestjs-ecommerce/products-service:latest .
docker build -f apps/shopping/Dockerfile -t nestjs-ecommerce/shopping-service:latest .

# Tag e push
docker tag nestjs-ecommerce/gateway:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/nestjs-ecommerce/gateway:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/nestjs-ecommerce/gateway:latest
# ... repetir para todos os serviços
```

### 3. Deploy no Kubernetes

```bash
# Aplicar manifesto base
kubectl apply -f k8s/base/namespace.yaml

# Aplicar configurações com Kustomize
kubectl apply -k k8s/overlays/aws/
```

### 4. Verificar Deploy

```bash
# Verificar pods
kubectl get pods -n ecommerce-microservices

# Verificar services
kubectl get services -n ecommerce-microservices

# Verificar ingress
kubectl get ingress -n ecommerce-microservices
```

## ⚙️ Configurações Importantes

### Secrets que Devem ser Atualizados

Antes do deploy, atualize os seguintes secrets:

```bash
# JWT Secret
kubectl create secret generic app-secrets \
  --from-literal=JWT_SECRET=your-super-secret-jwt-key \
  --from-literal=AWS_ACCESS_KEY_ID=your-aws-access-key \
  --from-literal=AWS_SECRET_ACCESS_KEY=your-aws-secret-key \
  -n ecommerce-microservices
```

### Storage Classes

O projeto usa GP3 volumes para melhor performance:
- `gp3-ssd`: Para volumes genéricos
- `gp3-mongodb`: Para MongoDB com IOPS otimizados

### Auto Scaling

Configurações de HPA:
- **Gateway**: 2-10 replicas
- **Products Service**: 2-8 replicas  
- **Auth Service**: 2-6 replicas
- **Customer Service**: 2-6 replicas
- **Shopping Service**: 2-6 replicas

Triggers: CPU > 70% ou Memory > 80%

## 🔐 Segurança

### Network Policies (Opcional)

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ecommerce-network-policy
  namespace: ecommerce-microservices
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ecommerce-microservices
```

### Pod Security Standards

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ecommerce-microservices
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

## 📊 Monitoramento

### Health Checks

Todos os serviços têm:
- **Liveness Probes**: Verificam se o pod está vivo
- **Readiness Probes**: Verificam se o pod está pronto para receber tráfego

### Logs

```bash
# Ver logs de um serviço específico
kubectl logs -f deployment/gateway -n ecommerce-microservices

# Ver logs de todos os pods de um serviço
kubectl logs -f -l app=gateway -n ecommerce-microservices
```

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Pods não inicializam**
   ```bash
   kubectl describe pod <pod-name> -n ecommerce-microservices
   ```

2. **Conectividade entre serviços**
   ```bash
   kubectl exec -it <pod-name> -n ecommerce-microservices -- nslookup mongodb-auth
   ```

3. **Persistent Volumes**
   ```bash
   kubectl get pvc -n ecommerce-microservices
   kubectl describe pvc <pvc-name> -n ecommerce-microservices
   ```

### Comandos Úteis

```bash
# Restart de um deployment
kubectl rollout restart deployment/gateway -n ecommerce-microservices

# Escalar manualmente
kubectl scale deployment gateway --replicas=5 -n ecommerce-microservices

# Port forward para teste local
kubectl port-forward svc/gateway 3000:80 -n ecommerce-microservices
```

## 🔄 CI/CD Integration

Para integrar com pipelines CI/CD, use:

```bash
# Update image tag
kubectl set image deployment/gateway gateway=$ECR_REGISTRY/nestjs-ecommerce/gateway:$BUILD_NUMBER -n ecommerce-microservices

# Wait for rollout
kubectl rollout status deployment/gateway -n ecommerce-microservices
```

## 💰 Custos Estimados (AWS)

### Recursos Base (us-east-1):
- **EKS Cluster**: ~$72/mês
- **EC2 Instances** (t3.medium x3): ~$95/mês
- **EBS Volumes** (GP3): ~$15/mês
- **Load Balancer**: ~$22/mês
- **NAT Gateway**: ~$45/mês

**Total Estimado**: ~$250-300/mês

### Otimizações de Custo:
- Use Spot Instances para workers
- Configure Cluster Autoscaler
- Use EFS em vez de EBS para volumes compartilhados
- Configure scheduled scaling para reduzir recursos fora do horário

## 🎯 Próximos Passos

1. **SSL/TLS**: Configure certificados SSL
2. **Monitoring**: Instale Prometheus/Grafana
3. **Logging**: Configure Fluentd/ELK stack
4. **Backup**: Configure backup dos volumes
5. **Disaster Recovery**: Configure multi-AZ deployment