# Food Calorie Analyzer

A web application that analyzes food images using AI to provide calorie estimates. Built with Node.js and deployed on AWS EKS with automated CI/CD.

## Overview

Upload a photo of your food and get instant calorie analysis powered by AWS Bedrock AI models. The application features a modern web interface with drag-and-drop functionality and real-time processing.

**Live Demo**: [Food Calorie Analyzer](http://k8s-default-foodcalo-4fb3e4c9d9-2140805673.us-west-2.elb.amazonaws.com)

## Features

- **Image Upload**: Drag & drop or click to upload food photos
- **AI Analysis**: Powered by AWS Bedrock Claude models
- **Instant Results**: Real-time calorie estimation and food identification
- **Mobile Friendly**: Responsive design works on all devices
- **Cloud Native**: Deployed on Kubernetes with auto-scaling

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **AI/ML**: AWS Bedrock (Claude 3 Haiku)
- **Infrastructure**: AWS EKS, Docker, Terraform
- **CI/CD**: GitHub Actions

## Architecture

## Quick Start

### Prerequisites
- AWS CLI configured
- Docker installed
- kubectl configured

### Local Development

1. Clone the repository:
git clone https://github.com/idan5353/CaloriesAnalyzer.git
cd CaloriesAnalyzer

text

2. Install dependencies:
npm install

text

3. Set environment variables:
export AWS_REGION=us-west-2

text

4. Run the application:
npm start

text

5. Open http://localhost:3000

## Deployment

### Automated Deployment
Push to the `main` branch and GitHub Actions will automatically:
- Build Docker image
- Push to Amazon ECR
- Deploy to EKS cluster
- Run health checks

### Manual Deployment

1. Deploy infrastructure:
cd terraform
terraform apply

text

2. Deploy application:
kubectl apply -f k8s/

text

## Project Structure

├── .github/workflows/ci-cd.yml # CI/CD pipeline
├── k8s/ # Kubernetes manifests
├── terraform/ # Infrastructure code
├── server.js # Main application
├── ai.js # AI integration
└── Dockerfile # Container configuration

text

## API Endpoints

### Upload Image
POST /api/upload
Content-Type: multipart/form-data

Field: photo (image file)

text

### Health Check
GET /health

text

## Configuration

Set these GitHub repository secrets for CI/CD:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (us-west-2)
- `ECR_REPOSITORY` (food-calorie-app)
- `EKS_CLUSTER_NAME` (food-calorie-eks)

## Usage

1. Visit the application URL
2. Upload a food image using drag & drop or file selection
3. Click "Analyze Calories"
4. View AI-generated results with calorie estimates

## Monitoring

Check application status:
kubectl get pods -l app=food-calorie
kubectl logs -l app=food-calorie

text

## Support

For issues or questions:
1. Check the application logs
2. Verify AWS Bedrock model access is enabled
3. Ensure all GitHub secrets are configured correctly

## License

MIT License - see LICENSE file for details.

---

**A cloud-native application demonstrating modern DevOps practices and AI integration**