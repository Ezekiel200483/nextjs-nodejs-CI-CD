# DevOps Engineer Assessment

## Introduction
Welcome! We are excited to have you complete this assessment as part of our hiring process.  

This challenge evaluates your **understanding of DevOps principles, problem-solving skills, and hands-on experience** in deploying applications using modern DevOps practices.

---

##  Assessment Overview
You are required to **containerize an application and deploy it to Kubernetes** using a CI/CD platform of your choice. Your approach should demonstrate best practices in automation, security, and scalability.

---

##  Instructions

### **1. Containerization**
- Containerize the provided application code.
- Ensure the Dockerfile follows best practices:
  - Use minimal image size.
  - Optimize caching for faster builds.
  - Avoid unnecessary dependencies.
- Run the container locally and confirm it works.

### **2. Kubernetes Deployment**
- Deploy the containerized application to a **Kubernetes cluster (EKS or GKE)**.
- Use Kubernetes manifests (`.yaml` files) or **Helm/Terraform** for deployment.
- Follow **best practices**:
  - Implement **liveness and readiness probes**.
  - Define **resource limits & requests**.
  - Use **secrets for sensitive configurations**.

### **3. CI/CD Pipeline**
- Implement a **CI/CD pipeline** using **GitHub Actions, Jenkins, GitLab CI/CD, or any platform of your choice**.
- Automate the following steps:
  - Build and test the application.
  - Security scans (if applicable).
  - Deploy the application to Kubernetes.
- Ensure pipeline efficiency with best practices like caching and parallel execution.

---

##  Assessment Criteria

Your work will be evaluated based on the following criteria:

| **Category** | **Details** | **Weight (%)** |
|-------------|------------|----------------|
| **DevOps Principles** | Use of automation, security best practices, and efficiency. 
| **CI/CD Implementation** | Well-structured, efficient pipeline with necessary validations. 
| **Kubernetes Deployment** | Proper use of manifests, Helm, or Terraform. Includes resource management & security. 
| **Problem-Solving Approach** | How you tackle challenges and document solutions. 
| **Documentation & Clarity** | Step-by-step documentation with screenshots. 

---

##  Submission Guidelines
Your submission should include a **publicly accessible Google Docs link** containing:

1. **Step-by-step approach** outlining your process.
2. **Screenshots**:
   - Your container running locally.
   - Kubernetes deployment confirmation.
3. **Breakdown of your CI/CD pipeline**:
   - Explain what each step does.
   - Provide YAML files or scripts used.
4. **Code snippets**:
   - Kubernetes manifests (or Helm/Terraform configurations).
   - CI/CD pipeline scripts.
   - Dockerfile.
5. **Challenges faced & how you solved them** (if applicable).

---

## FAQs

### **1. What cloud platforms are acceptable?**
You can use **AWS EKS or GCP GKE** for Kubernetes deployment.

### **2. I don’t have cloud credits. What should I do?**
We are assessing your **approach and CI/CD workflow, not a live running application**. You may submit Kubernetes manifests and CI/CD scripts without deploying to the cloud.

### **3. When is the deadline?**
- **Start Date:** March 13, 2025  
- **Submission Deadline:** March 16, 2025, at **9 PM**  

### **4. What tools can I use?**
- **CI/CD:** GitHub Actions, Jenkins, GitLab CI/CD, CircleCI, etc.
- **Kubernetes Management:** `kubectl`, Helm, Terraform, etc.
- **Containerization:** Docker, Podman, etc.

### **5. Should the Kubernetes service be exposed via LoadBalancer or ClusterIP?**
You may expose it using **LoadBalancer** (for external access) or **ClusterIP** (if not needed). Explain your choice in the documentation.

---

## Final Notes
- Focus on **clarity, automation, and best practices**.
- Ensure your **Google Docs submission is accessible to view**.
- If you face any blockers, document them and explain your approach.
- For any Questions,Please reach out okiki@awarri.com
 **Good luck! We look forward to your submission.** 
