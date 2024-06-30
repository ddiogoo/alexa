const AWS = require("aws-sdk");
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');

const { TABLE_NAME, REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY } = require('./config/config');

/**
 * Custom DynamoDB persistence adapter.
 */
class CustomDynamoDbPersistenceAdapter extends ddbAdapter.DynamoDbPersistenceAdapter {
    /**
     * Get the attributes for the user.
     * @param {*} requestEnvelope 
     * @returns 
     */
    async getAttributes(requestEnvelope) {
        const userId = requestEnvelope.context.System.user.userId;
        const params = {
            TableName: this.tableName,
            Key: { 
                'id': { S: userId },
            }
        };
        const result = await this.dynamoDBClient.getItem(params).promise();
        return result.Item ? this.mapItemToAttributes(result.Item) : {};
    }

    /**
     * Save the attributes for the user.
     * @param {*} requestEnvelope The request envelope.
     * @param {*} attributes The attributes to save.
     */
    async saveAttributes(requestEnvelope, attributes) {
        const userId = requestEnvelope.context.System.user.userId;
        const item = {
            'id': { S: userId },
            'city': { S: attributes.city }
        };
        const params = {
            TableName: this.tableName,
            Item: item
        };
        await this.dynamoDBClient.putItem(params).promise();
    }
    
    /**
     * Map the attributes to the item.  
     * @param {*} attributes The attributes to map.
     * @returns Returns the item.
     */
    mapAttributesToItem(attributes) {
        const item = {};
        for (const key of Object.keys(attributes)) {
            item[key] = { S: attributes[key].toString() };
        }
        return item;
    }

    /**
     * Map the item to the attributes.
     * @param {*} item 
     * @returns 
     */
    mapItemToAttributes(item) {
        const attributes = {};
        for (const key of Object.keys(item)) {
            attributes[key] = item[key].S;
        }
        return attributes;
    }
}

/**
 * The DynamoDB adapter instance.
 */
const ddbAdapterInstance = new CustomDynamoDbPersistenceAdapter({
    tableName: TABLE_NAME,
    createTable: false,
    dynamoDBClient: new AWS.DynamoDB({
        apiVersion: 'latest',
        region: REGION,
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    })
});

module.exports = { ddbAdapterInstance };