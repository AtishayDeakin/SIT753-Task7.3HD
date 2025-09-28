pipeline {
  agent any
  environment {
    IMAGE = "devops-sample-api:${env.BUILD_NUMBER}"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
        sh 'docker build -t $IMAGE .'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Code Quality') {
      steps {
        echo 'Run SonarQube analysis (placeholder)'
        // withSonarQubeEnv('SonarQube') {
        //   sh 'sonar-scanner'
        // }
      }
    }
    stage('Security') {
      steps {
        echo 'Run Snyk/Trivy scans (placeholder)'
        // sh 'snyk test || true'
      }
    }
    stage('Deploy to Staging') {
      steps {
        sh 'docker tag $IMAGE devops-sample-api:staging'
        sh 'docker-compose -f docker-compose.yml up -d --build'
      }
    }
    stage('Release') {
      steps {
        input message: 'Promote to production?', ok: 'Yes, release'
        sh 'docker tag $IMAGE devops-sample-api:latest'
        // push to registry if configured
      }
    }
    stage('Monitoring') {
      steps {
        echo 'Ensure /metrics endpoint is reachable; integrate Prometheus/Grafana in production'
      }
    }
  }
  post {
    always {
      sh 'docker images --format "{{.Repository}}:{{.Tag}}	{{.ID}}	{{.Size}}" || true'
    }
  }
}
