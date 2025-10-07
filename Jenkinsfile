pipeline {
    // Agent directive tells Jenkins where to run the pipeline
    // 'any' means any available agent/node
    agent any
    
    // Environment variables available throughout the pipeline
    environment {
        // Docker registry configuration
        DOCKER_REGISTRY = 'docker.io'  // Change to your registry
        DOCKER_REPO = 'ezekiel200483'  // Replace with your username
        
        // Image names for your microservices
        FRONTEND_IMAGE = "${DOCKER_REPO}/nextjs-frontend"
        BACKEND_IMAGE = "${DOCKER_REPO}/nodejs-backend"
        
        // Build number for tagging
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        
        // Git commit hash for unique tagging
        GIT_COMMIT_SHORT = sh(
            script: "git rev-parse --short HEAD",
            returnStdout: true
        ).trim()
    }
    
    // Stages define the major steps in your CI pipeline
    stages {
        
        // Stage 1: Checkout code (automatic in most cases)
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                // This stage is often implicit, but good for visibility
                checkout scm
            }
        }
        
        // Stage 2: Install dependencies and run tests for both services
        stage('Test Applications') {
            // Parallel execution for faster builds
            parallel {
                stage('Test Frontend') {
                    steps {
                        dir('Next.js frontend') {
                            echo 'Installing frontend dependencies...'
                            sh 'npm ci'
                            
                            echo 'Running frontend linting...'
                            sh 'npm run lint'
                            
                            echo 'Building frontend application...'
                            sh 'npm run build'
                        }
                    }
                }
                
                stage('Test Backend') {
                    steps {
                        dir('Node.js backend') {
                            echo 'Installing backend dependencies...'
                            sh 'npm ci'
                            
                            echo 'Running backend tests...'
                            // Add your test command here when you have tests
                            sh 'echo "No tests defined yet - add npm test"'
                            
                            echo 'Checking backend syntax...'
                            sh 'node -c server.js'
                        }
                    }
                }
            }
        }
        
        // Stage 3: Build Docker images
        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        dir('Next.js frontend') {
                            echo 'Building frontend Docker image...'
                            script {
                                // Build the Docker image
                                def frontendImage = docker.build("${FRONTEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}")
                                
                                // Tag as latest
                                frontendImage.tag("${FRONTEND_IMAGE}:latest")
                                
                                // Store for later use
                                env.FRONTEND_IMAGE_BUILT = "${FRONTEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}"
                            }
                        }
                    }
                }
                
                stage('Build Backend Image') {
                    steps {
                        dir('Node.js backend') {
                            echo 'Building backend Docker image...'
                            script {
                                // Build the Docker image
                                def backendImage = docker.build("${BACKEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}")
                                
                                // Tag as latest
                                backendImage.tag("${BACKEND_IMAGE}:latest")
                                
                                // Store for later use
                                env.BACKEND_IMAGE_BUILT = "${BACKEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}"
                            }
                        }
                    }
                }
            }
        }
        
        // Stage 4: Security scanning (optional but recommended)
        stage('Security Scan') {
            when {
                // Only run on main branch or when explicitly requested
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            parallel {
                stage('Scan Frontend') {
                    steps {
                        dir('Next.js frontend') {
                            echo 'Running security audit on frontend...'
                            sh 'npm audit --audit-level moderate || true'
                        }
                    }
                }
                
                stage('Scan Backend') {
                    steps {
                        dir('Node.js backend') {
                            echo 'Running security audit on backend...'
                            sh 'npm audit --audit-level moderate || true'
                        }
                    }
                }
            }
        }
        
        // Stage 5: Push to Docker Registry
        stage('Push Images') {
            when {
                // Only push on main/master branch
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    // Login to Docker registry (requires credentials configured in Jenkins)
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-hub-credentials') {
                        
                        echo 'Pushing frontend image...'
                        def frontendImage = docker.image("${FRONTEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}")
                        frontendImage.push()
                        frontendImage.push('latest')
                        
                        echo 'Pushing backend image...'
                        def backendImage = docker.image("${BACKEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}")
                        backendImage.push()
                        backendImage.push('latest')
                    }
                }
            }
        }
        
        // Stage 6: Update Kubernetes manifests (for GitOps with ArgoCD)
        stage('Update K8s Manifests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo 'Updating Kubernetes manifests with new image tags...'
                    
                    // Update frontend deployment
                    sh """
                        sed -i 's|image: ${FRONTEND_IMAGE}:.*|image: ${FRONTEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}|g' k8s/frontend/deployment.yaml
                    """
                    
                    // Update backend deployment  
                    sh """
                        sed -i 's|image: ${BACKEND_IMAGE}:.*|image: ${BACKEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}|g' k8s/backend/deployment.yaml
                    """
                    
                    // Commit changes back to repo (requires Git credentials)
                    sh """
                        git config user.email "jenkins@yourdomain.com"
                        git config user.name "Jenkins CI"
                        git add k8s/
                        git commit -m "Update images to build ${BUILD_NUMBER}-${GIT_COMMIT_SHORT}" || true
                        git push origin HEAD:main || true
                    """
                }
            }
        }
    }
    
    // Post-build actions
    post {
        // Always runs regardless of build result
        always {
            echo 'Cleaning up...'
            
            // Clean up Docker images to save space
            sh """
                docker rmi ${FRONTEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT} || true
                docker rmi ${BACKEND_IMAGE}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT} || true
                docker system prune -f || true
            """
        }
        
        // Runs only on successful builds
        success {
            echo 'Build completed successfully!'
            
            // Send notification (configure email/Slack plugin)
            // emailext (
            //     subject: "✅ Build Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            //     body: "Build completed successfully for commit ${GIT_COMMIT_SHORT}",
            //     to: "team@yourdomain.com"
            // )
        }
        
        // Runs only on failed builds
        failure {
            echo 'Build failed!'
            
            // Send failure notification
            // emailext (
            //     subject: "❌ Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            //     body: "Build failed for commit ${GIT_COMMIT_SHORT}. Check Jenkins for details.",
            //     to: "team@yourdomain.com"
            // )
        }
    }
}
