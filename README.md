# DevOps Sample API

This is a sample Node.js Express API used to demonstrate a Jenkins DevOps pipeline for SIT753 High Distinction Task.

## Features
- Simple CRUD endpoints for `items`.
- `/health` and `/metrics` endpoints for monitoring.
- Jest tests with Supertest.

## Run locally
1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Start: `npm start`
4. Docker: `docker build -t devops-sample-api . && docker run -p 3000:3000 devops-sample-api`

## Jenkins pipeline
See `Jenkinsfile` in the repository root — includes Build, Test, Code Quality, Security, Deploy, Release, Monitoring stages.
