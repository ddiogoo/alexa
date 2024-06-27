# Alexa Skills

This application is a distributed system of a custom Alexa skill. It uses AWS Lambda as a trigger, DynamoDB for data persistence and Node.js as the main language for skill development.

## Prerequisites

- AWS account.
- Amazon Developer account.
- User permission to obtain the access key and secret access key.

## How to configure

### Configure database

For the database, you need to fill in the `config.js` file with your AWS account information, as well as the table you created in DynamoDB.

### Configure API

The API key can be obtained from this [website](https://openweathermap.org/api). After obtaining the API key, you need to insert it in the `config.js` file.

### Configure AWS Lambda

When creating an AWS Lambda with access permission to DynamoDB, you must enter the trigger as “Alexa”.

1. Enter your Alexa skill ID in AWS Lambda.
2. Get the function ARN of the created Lambda.
3. Enter the ARN function obtained in "Default Region" in the Alexa endpoint settings, located in "Build".

### Important

Note that inside the `interactionModel` folder there is a Json with the intents created by me and if you want to run this project, you need to import them into the "JSON Editor" in "Interaction Model".