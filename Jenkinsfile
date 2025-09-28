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
        withSonarQubeEnv('SonarQube') {
          sh 'sonar-scanner -Dsonar.projectKey=devops-sample -Dsonar.sources=.'
        }
      }
    }
    stage('Security') {
      steps {
        withCredentials([string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')]) {
          sh 'snyk auth $SNYK_TOKEN'
          sh 'snyk test || true'
        }
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
        sh 'docker save $IMAGE -o devops-sample-api.tar'
        archiveArtifacts artifacts: 'devops-sample-api.tar', fingerprint: true
      }
    }
    stage('Monitoring') {
      steps {
        script {
          def result = sh(script: "curl -s http://localhost:3000/metrics | head -n 5", returnStdout: true)
          echo "Metrics output sample:\n${result}"
        }
      }
    }
  }
  post {
    always {
      sh 'docker images --format "{{.Repository}}:{{.Tag}}	{{.ID}}	{{.Size}}" || true'
    }
  }
}