import AWS from 'aws-sdk';
const DocumentClient = new AWS.DynamoDB.DocumentClient(); //DocumentClient fot Connecting to DynamoDB and insert tables

export async function closeAuction(auction){
    const params = {
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: 'set #status = :state',
        ExpressionAttributeValues: {
          ':state': 'CLOSED',
        },
        ExpressionAttributeNames: { //https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
            '#status': 'status',
          },
          ReturnValues: 'ALL_NEW'
      };
      const result = await DocumentClient.update(params).promise();
     return result;
};