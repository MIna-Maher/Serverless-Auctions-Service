import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';//Default export, can import without{};
import schemaValidator from '@middy/validator';
import getAuctionsSchame from '../lib/schemas/getAuctionsSchemas';
var createError = require('http-errors');
const DocumentClient = new AWS.DynamoDB.DocumentClient(); //DocumentClient fot Connecting to DynamoDB and insert tables
async function getAuction(event, context) { // those arguments will be provided when lambda executed.
    let auctions;  //defining auction and can be assigned later.
    const { status } = event.queryStringParameters; //pasing the querystringparamerter value when making the request.
   let params = {
      TableName: process.env.AUCTION_TABLE_NAME,
      IndexName: 'statusAndEndDateGSI',
      KeyConditionExpression: '#status = :status',//status and endingDate are the primary key and sort key of GSI.
      ExpressionAttributeValues: {
        ':status': status ,
      },
      ExpressionAttributeNames: { //https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
          '#status': 'status',
        },
   };
 try{
    const result = await DocumentClient.query(params).promise();
     auctions = result;
    } catch(error) {
      console.error(error);
      throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
   };
};

export const handler = commonMiddleware(getAuction)
.use(schemaValidator({ inputSchema: getAuctionsSchame, useDefaults: true }));