pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'adiii999'
        IMAGE_NAME         = 'calculator-app'
        IMAGE_TAG          = "${BUILD_NUMBER}"
        DOCKER_CREDS       = credentials('dockerhub-credentials')
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Checking out source code from Git...'
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Verifying application assets...'
                sh '''
                    test -f index.html || exit 1
                    test -f style.css || exit 1
                    test -f app.js || exit 1
                    echo "Static asset integrity verified successfully."
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker container image...'
                sh """
                    docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest
                """
            }
        }

        stage('Push Image') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                sh """
                    echo \$DOCKER_CREDS_PSW | docker login -u \$DOCKER_CREDS_USR --password-stdin
                    docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}
                    docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Applying Kubernetes manifests...'
                sh """
                    sed -i "s|image: .*/calculator-app:.*|image: ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}|g" k8s/deployment.yaml
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                """
            }
        }

        stage('Verification') {
            steps {
                echo 'Verifying deployment rollout...'
                sh """
                    kubectl rollout status deployment/calculator-app --timeout=60s
                    kubectl get pods -l app=calculator
                    kubectl get svc calculator-service
                """
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            echo "Pipeline succeeded! Application deployed and ready on port 30080."
        }
        failure {
            echo "Pipeline failed. Check stage logs for errors."
        }
    }
}
