import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';//Default export, can import without{};
var createError = require('http-errors');
const DocumentClient = new AWS.DynamoDB.DocumentClient(); //DocumentClient fot Connecting to DynamoDB and insert tables
async function getAuction(event, context) { // those arguments will be provided when lambda executed.
    let auctions;  //defining auction and can be assigned later.
 try{
    const result = await DocumentClient.scan({
     TableName: process.env.AUCTION_TABLE_NAME
    }
    ).promise();
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

export const handler = commonMiddleware(getAuction);
