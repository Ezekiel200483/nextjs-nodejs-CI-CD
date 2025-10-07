pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REPO = 'ezekiel200483'
        FRONTEND_IMAGE = "${DOCKER_REPO}/nextjs-frontend"
        BACKEND_IMAGE = "${DOCKER_REPO}/nodejs-backend"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Test Environment') {
            steps {
                echo 'Testing environment...'
                sh 'pwd'
                sh 'ls -la'
                sh 'docker --version || echo "Docker not available"'
                sh 'node --version || echo "Node.js not available"'
                sh 'npm --version || echo "npm not available"'
            }
        }
        
        stage('Test Applications') {
            parallel {
                stage('Test Frontend') {
                    steps {
                        script {
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
                }
                
                stage('Test Backend') {
                    steps {
                        script {
                            dir('Node.js backend') {
                                echo 'Installing backend dependencies...'
                                sh 'npm ci'
                                
                                echo 'Checking backend syntax...'
                                sh 'node -c server.js'
                            }
                        }
                    }
                }
            }
        }
        
        stage('Build Info') {
            steps {
                script {
                    echo "Would build images:"
                    echo "Frontend: ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                    echo "Backend: ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                    echo "Build successful - Docker operations disabled for testing"
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed!'
        }
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
