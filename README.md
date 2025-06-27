# Simple auth web application using AWS
This project provides a simple web application using user authentication and automated web deployment to test out some AWS services:
- Amplify: deploy static resources for the web application
- Lambda: on-demand executed function which is used here to save user data to the database upon sign-up
    1. uses GraphQL to store data to DynamoDB
    2. needed to receive authentication trigger from Cognito
- AWS AppSync: single GraphQL endpoint which is managed (abstraction)
    1. single endpoint
    2. simple frontend: just use createUser, getUser functions
    3. amplify creates React GraphQL clients
    4. integration with Cognito and IAM
    5. clarity and maintainability
- GraphQL: API to communicate to DynamoDB
- DynamoDB: database to store user data
- Cognito: Authentication manager

## Possible interactions
1. Sign-up:
    - enter data to Amplify -> Cognito handles sign-up -> on successful confirmation Lambda function is triggered -> calls AppSync (GraphQL) -> writes user data to DynamoDB -> continue with interaction 3
2. Sign-in
    - Amplify -> Cognito -> return token -> continue with interaction 3
3. Frontend reads data
    - react app places GraphQL querry getUser to AppSync -> AppSync checks auth with Cognito -> AppSync fetches data -> DynamoDB provides data -> returns data to app
4. View UI / Refresh App
    - React app loads from Amplify -> app authenticates user -> Cognito returns user info/token from cached session -> continue with interaction 3
5. Change age and load it again: ...
