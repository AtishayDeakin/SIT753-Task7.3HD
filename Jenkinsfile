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
                bat 'npm install'
                bat 'npm run build'
                bat 'docker build -t %IMAGE% .'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('Code Quality') {
            steps {
                withCredentials([string(credentialsId: 'SonarQube', variable: 'SONAR_TOKEN')]) {
                    bat "sonar-scanner -Dsonar.projectKey=SIT753-7.3HD -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.login=%SONAR_TOKEN%"
                }
            }
        }

        stage('Security') {
            steps {
                withCredentials([string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')]) {
                    bat 'snyk auth %SNYK_TOKEN%'
                    bat 'snyk test || exit /b 0'
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                bat 'docker tag %IMAGE% devops-sample-api:staging'
                bat 'docker-compose -f docker-compose.yml up -d --build'
            }
        }

        stage('Release') {
            steps {
                input message: 'Promote to production?', ok: 'Yes, release'
                bat 'docker tag %IMAGE% devops-sample-api:latest'
                bat 'docker save %IMAGE% -o devops-sample-api.tar'
                archiveArtifacts artifacts: 'devops-sample-api.tar', fingerprint: true
            }
        }

        stage('Monitoring') {
            steps {
                script {
                    def result = bat(script: 'powershell -Command "Invoke-RestMethod http://localhost:3000/metrics | Select-Object -First 5"', returnStdout: true)
                    echo "Metrics output sample:\n${result}"
                }
            }
        }
    }

    post {
        always {
            bat 'docker images --format "%%Repository%%:%%Tag%%\t%%ID%%\t%%Size%%" || exit /b 0'
        }
    }
}