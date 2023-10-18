/* groovylint-disable LineLength */
pipeline {
    agent any
    environment {
        DEPLOY_TARGET = '/mnt/siscphwebapp11/autodeployments/ctc_api_flyer'
    }
    stages {
        stage('Build') {
            steps {
                echo "Building branch ${GIT_BRANCH} using Commit Id ${GIT_COMMIT}"
                sh 'npm install'
                sh 'npm run build:staging'
            }
        }
        stage('Deploy') {
            steps {
                echo "Copying built files to ${DEPLOY_TARGET}"
                sh "cp -uRv \"${WORKSPACE}/dist/.\" \"${DEPLOY_TARGET}\""
            }
        }
    }
    post {
        failure {
                emailext attachLog: true, body: '''Build failed. Details:

Job Name: $JOB_NAME
Branch: $GIT_BRANCH
Commit: $GIT_COMMIT
Author: $CHANGE_AUTHOR_DISPLAY_NAME

Build log is attached.

This is an automated email. Do not reply.''', recipientProviders: [developers()], replyTo: 'no-reply@tc.tc', subject: "BUILD FAILURE: ${JOB_NAME}, Branch: ${GIT_BRANCH}, Commit: ${GIT_COMMIT}"
            }
            }
}
