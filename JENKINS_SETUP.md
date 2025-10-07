# Jenkins CI Setup Guide

## 📚 Key Jenkins Concepts You Need to Understand

### 1. **Pipeline as Code (Jenkinsfile)**
- **What it is**: Your CI/CD pipeline defined in code, stored in your repository
- **Why it matters**: Version controlled, reproducible, reviewable
- **Documentation**: [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)

### 2. **Jenkins Pipeline Syntax**
The Jenkinsfile uses either:
- **Declarative Pipeline**: Easier to learn (what we're using)
- **Scripted Pipeline**: More flexible but complex

### 3. **Key Pipeline Components**

#### **Agent Directive**
```groovy
agent any  // Run on any available Jenkins node
```

#### **Environment Variables**
```groovy
environment {
    DOCKER_REGISTRY = 'docker.io'
    FRONTEND_IMAGE = "${DOCKER_REPO}/nextjs-frontend"
}
```

#### **Stages and Steps**
```groovy
stages {
    stage('Build') {
        steps {
            sh 'npm install'
        }
    }
}
```

#### **Parallel Execution**
```groovy
parallel {
    stage('Test Frontend') { ... }
    stage('Test Backend') { ... }
}
```

## 🚀 Setting Up Jenkins

### **Option 1: Local Jenkins with Docker (Recommended for Learning)**

1. **Run Jenkins in Docker**:
```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

2. **Get Initial Admin Password**:
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

3. **Access Jenkins**: http://localhost:8080

### **Option 2: Jenkins on Cloud (AWS/GCP/Azure)**
- Use managed Jenkins services
- Or deploy Jenkins on a VM/container

### **Option 3: Jenkins on Kubernetes**
- Use Helm charts for Jenkins deployment

## 🔧 Jenkins Configuration Steps

### **Step 1: Install Required Plugins**
After initial setup, install these plugins:
- **Docker Plugin**: For Docker operations
- **GitHub Plugin**: For GitHub integration
- **Pipeline Plugin**: For pipeline support (usually pre-installed)
- **Blue Ocean Plugin**: Modern UI (optional)

### **Step 2: Configure Global Tools**
Go to: **Manage Jenkins** → **Global Tool Configuration**

Configure:
- **JDK**: Add if needed
- **Git**: Usually auto-detected
- **Docker**: Add Docker installation

### **Step 3: Add Credentials**
Go to: **Manage Jenkins** → **Manage Credentials**

Add:
1. **Docker Hub Credentials**
   - Kind: Username with password
   - ID: `docker-hub-credentials`
   - Username: Your Docker Hub username
   - Password: Your Docker Hub password/token

2. **GitHub Credentials** (if private repo)
   - Kind: Username with password or SSH key
   - ID: `github-credentials`

### **Step 4: Create a Multibranch Pipeline**

1. **New Item** → **Multibranch Pipeline**
2. **Branch Sources** → **Add Source** → **GitHub**
3. Configure:
   - Repository URL: `https://github.com/Ezekiel200483/nextjs-nodejs-CI-CD`
   - Credentials: Select GitHub credentials (if private)
   - Behaviors: Add "Discover branches" and "Discover pull requests"

### **Step 5: Configure Webhooks (Optional but Recommended)**

In your GitHub repository:
1. Go to **Settings** → **Webhooks**
2. Add webhook:
   - Payload URL: `http://your-jenkins-url/github-webhook/`
   - Content type: `application/json`
   - Events: Push events, Pull request events

## 🎯 Understanding Your Jenkinsfile

### **Stage Breakdown**:

1. **Checkout**: Gets your code from GitHub
2. **Test Applications**: Runs tests and builds in parallel
3. **Build Docker Images**: Creates Docker images for both services
4. **Security Scan**: Runs npm audit for vulnerabilities
5. **Push Images**: Pushes to Docker registry (only on main branch)
6. **Update K8s Manifests**: Updates image tags for GitOps

### **Key Learning Points**:

#### **Parallel Execution**
```groovy
parallel {
    stage('Test Frontend') { ... }
    stage('Test Backend') { ... }
}
```
- Speeds up builds by running tasks simultaneously
- Good for independent tasks like testing different services

#### **Conditional Execution**
```groovy
when {
    anyOf {
        branch 'main'
        branch 'master'
    }
}
```
- Only push images and update manifests on main branch
- Prevents unnecessary deployments from feature branches

#### **Environment Variables**
```groovy
GIT_COMMIT_SHORT = sh(
    script: "git rev-parse --short HEAD",
    returnStdout: true
).trim()
```
- Dynamic variables for unique image tagging
- Combines build number and git commit for traceability

#### **Docker Integration**
```groovy
def frontendImage = docker.build("${FRONTEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}")
```
- Uses Jenkins Docker plugin
- Builds and tags images within the pipeline

## 🔍 Troubleshooting Common Issues

### **Permission Issues**
If Docker commands fail:
```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins
```

### **Git Push Issues**
Configure Git credentials in Jenkins or use SSH keys.

### **Node.js Version Issues**
Install Node.js on Jenkins agent or use Docker for Node.js builds.

## 📖 Next Steps

1. **Customize the Jenkinsfile** for your specific needs
2. **Add actual tests** to your frontend/backend
3. **Configure notifications** (email, Slack)
4. **Set up quality gates** (code coverage, security scans)
5. **Learn about Jenkins shared libraries** for reusable pipeline code

## 📚 Additional Resources

- [Jenkins Handbook](https://www.jenkins.io/doc/book/)
- [Pipeline Syntax Reference](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Docker Plugin Documentation](https://plugins.jenkins.io/docker-plugin/)
- [Best Practices](https://www.jenkins.io/doc/book/pipeline/pipeline-best-practices/)

## 🎓 Understanding GitOps Flow

Your Jenkins pipeline implements GitOps by:
1. Building and pushing images
2. Updating Kubernetes manifests with new image tags
3. Committing changes back to Git
4. ArgoCD will detect these changes and deploy automatically

This creates a complete CI/CD flow where:
- **CI (Jenkins)**: Tests, builds, and updates manifests
- **CD (ArgoCD)**: Deploys based on Git state
