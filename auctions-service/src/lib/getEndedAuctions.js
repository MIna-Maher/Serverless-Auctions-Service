import AWS from 'aws-sdk';
const DocumentClient = new AWS.DynamoDB.DocumentClient(); //DocumentClient fot Connecting to DynamoDB and insert tables

export async function getEndedAuctions(){
    const nowTime = new Date();
    const  params = {
        TableName: process.env.AUCTION_TABLE_NAME,
        IndexName: 'statusAndEndDateGSI',
        KeyConditionExpression: '#status = :status AND endingDate <= :now',//status and endingDate are the primary key and sort key of GSI.
        ExpressionAttributeValues: {
          ':status': 'OPEN',
          ':now': nowTime.toISOString(),
        },
        ExpressionAttributeNames: { //https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
            '#status': 'status',
          },
      };
      const result = await DocumentClient.query(params).promise();
     return result.Items;
};