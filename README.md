![Node.js](https://img.shields.io/badge/Node.js-5FA04E.svg?logo=nodedotjs&logoColor=white)
![Amazon Alexa](https://img.shields.io/badge/Amazon%20Alexa-00CAFF.svg?logo=Amazon-Alexa&logoColor=white)
![Amazon DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6.svg?logo=Amazon-DynamoDB&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-FF9900.svg?logo=AWS-Lambda&logoColor=white)

# Alexa

This application is a distributed system of a custom Alexa skill. It uses AWS Lambda as a trigger, DynamoDB (non-relational database) for data persistence and Node.js as the main language for skill development. This work is a project related to the topic of serverless computing.

## Prerequisites

- AWS account.
- Amazon Developer account.
- User permission to obtain the access key and secret access key.

## Configure

### *Configure database*

For the database, you need to fill in the `config.js` file with your AWS account information, as well as the table you created in DynamoDB.

### *Configure API*

The API key can be obtained from this [website](https://openweathermap.org/api). After obtaining the API key, you need to insert it in the `config.js` file.

### *Configure AWS Lambda*

When creating an AWS Lambda with access permission to DynamoDB, you must enter the trigger as “Alexa”.

1. Enter your Alexa skill ID in AWS Lambda.
2. Get the function ARN of the created Lambda.
3. Enter the ARN function obtained in "Default Region" in the Alexa endpoint settings, located in "Build".

### *Important*

Note that inside the `interactionModel` folder there is a Json with the intents created by me and if you want to run this project, you need to import them into the "JSON Editor" in "Interaction Model".

## Conventional Commits

This project uses the Conventional Commits specification. Access the documentation [here](https://www.conventionalcommits.org/en/v1.0.0/) to understand how to use it.
