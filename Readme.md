# AWS Cloud-Native Food Analysis Platform

## 🏗️ Architecture Overview

This project demonstrates a production-ready, cloud-native application built on AWS infrastructure, showcasing modern DevOps practices, containerization, and AI integration.


<img width="1914" height="999" alt="analize AI burger" src="https://github.com/user-attachments/assets/bd020d59-e1da-4056-bb84-2f88b1fd001a" />
<img width="1920" height="996" alt="pizza analyze2" src="https://github.com/user-attachments/assets/5d3022dc-bf30-48b7-8e49-b79d0e952c76" />
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
<img width="1917" height="996" alt="pizza analyze1" src="https://github.com/user-attachments/assets/7924e433-158f-44d2-b936-11cac8b8c016" />
<img width="1920" height="998" alt="analize AI burger2" src="https://github.com/user-attachments/assets/4dfd7098-4d1c-4dc2-b203-8fc557c339d3" />

## 📋 Project Description

A sophisticated food analysis platform that leverages AWS services and AI capabilities to provide intelligent food recognition and nutritional analysis. The application is built with scalability, security, and automation at its core.

## 🎯 Key Features

- **AI-Powered Analysis**: Integration with AWS Bedrock for advanced food recognition and nutritional information
- **Cloud-Native Architecture**: Fully containerized deployment on AWS EKS (Elastic Kubernetes Service)
- **Automated CI/CD**: GitHub Actions pipeline for continuous integration and deployment
- **Enterprise Security**: IRSA (IAM Roles for Service Accounts) for secure, fine-grained AWS permissions
- **High Availability**: Auto-scaling and load balancing for optimal performance
- **Modern Tech Stack**: Node.js backend with containerized microservices architecture

## 🔧 Technical Stack

### Cloud Infrastructure
- **AWS EKS**: Managed Kubernetes cluster for container orchestration
- **AWS Bedrock**: AI/ML service for food analysis and recognition
- **AWS IAM**: Identity and Access Management with IRSA for service authentication
- **Elastic Load Balancer**: Traffic distribution and high availability
- **Amazon ECR**: Container registry for Docker images

### Application Layer
- **Node.js**: Backend runtime environment
- **Docker**: Containerization platform
- **Kubernetes**: Container orchestration and management

### CI/CD Pipeline
- **GitHub Actions**: Automated build, test, and deployment workflows
- **Docker Build**: Automated container image creation
- **Kubectl**: Kubernetes deployment automation

## 🏛️ Architecture Components

### 1. User Interface Layer
- Web-based interface for food image upload and analysis
- Real-time results display
- Responsive design for multiple devices

### 2. Application Layer (EKS Cluster)
- **Containerized Node.js Applications**: Microservices running in Kubernetes pods
- **Auto-scaling**: Horizontal Pod Autoscaler (HPA) based on load
- **Service Mesh**: Internal service communication and load balancing

### 3. AI Integration Layer
- **AWS Bedrock**: AI models for food recognition
- Nutritional database integration
- Real-time image analysis

### 4. Security Layer
- **IRSA Configuration**: Pod-level IAM roles for secure AWS service access
- No long-lived credentials stored in containers
- Principle of least privilege access

### 5. DevOps Pipeline
```
Code Push → GitHub Actions → Build Docker Image → Push to ECR → Deploy to EKS → Health Check
```

## 🚀 Deployment Flow

1. **Developer pushes code** to GitHub repository
2. **GitHub Actions triggered** automatically
3. **Application built and tested** in CI environment
4. **Docker image created** and tagged with version
5. **Image pushed** to Amazon ECR
6. **Kubernetes deployment updated** via kubectl
7. **Rolling update performed** on EKS cluster
8. **Health checks verify** deployment success

## 🔐 Security Features

- **IRSA (IAM Roles for Service Accounts)**: Kubernetes pods assume IAM roles without static credentials
- **Network Policies**: Controlled traffic flow between services
- **Secrets Management**: Kubernetes secrets for sensitive configuration
- **Container Security**: Regular vulnerability scanning of images
- **TLS/SSL**: Encrypted communication between services

## 📊 Scalability & Performance

- **Horizontal Auto-scaling**: Automatic pod scaling based on CPU/memory metrics
- **Load Balancing**: Traffic distribution across multiple pod instances
- **Resource Management**: CPU and memory limits/requests defined
- **Cluster Auto-scaling**: Node pool expansion during high demand

## 🛠️ Local Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run locally
npm run dev
```

## 🌐 Deployment

### Prerequisites
- AWS Account with appropriate permissions
- EKS cluster configured
- kubectl configured for your cluster
- GitHub repository secrets configured

### Environment Variables
```
AWS_REGION=<your-region>
EKS_CLUSTER_NAME=<cluster-name>
ECR_REPOSITORY=<ecr-repo-url>
BEDROCK_MODEL_ID=<model-id>
```

### Deploy to EKS
```bash
# Build Docker image
docker build -t food-analysis-app .

# Tag and push to ECR
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker tag food-analysis-app:latest <ecr-url>:latest
docker push <ecr-url>:latest

# Apply Kubernetes manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## 📈 Monitoring & Observability

- **CloudWatch Integration**: Centralized logging and metrics
- **Kubernetes Dashboard**: Cluster visualization
- **Application Logs**: Structured logging with log aggregation
- **Health Endpoints**: Liveness and readiness probes

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
- ✅ Cloud-native application development
- ✅ Kubernetes orchestration and management
- ✅ AWS services integration (EKS, Bedrock, IAM, ECR)
- ✅ CI/CD pipeline implementation
- ✅ Container security best practices
- ✅ Infrastructure as Code principles
- ✅ Microservices architecture
- ✅ AI/ML service integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- AWS for providing robust cloud infrastructure
- Kubernetes community for excellent documentation
- Open source contributors

---

**Note**: This project is designed to showcase modern cloud-native development practices and enterprise-grade architecture suitable for production environments.
