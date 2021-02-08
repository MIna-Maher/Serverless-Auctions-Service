import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
var createError = require('http-errors');
import { getAuctionByIdValidation } from './getAuctionById';
const DocumentClient = new AWS.DynamoDB.DocumentClient(); //DocumentClient fot Connecting to DynamoDB and insert tables
async function placingBid(event, context) { // those arguments will be provided when lambda executed.
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const params = {
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
          ':amount': amount,
        },
        ReturnValues: 'ALL_NEW'
    };

    let updatedAuction;
const auction = await getAuctionByIdValidation(id);//calling function
//validating the number of bid
if(auction.highestBid.amount >= amount){
    throw new createError.Forbidden(`YOUR BID must be higher than "${auction.highestBid.amount}"`);
};
//Validating Bidding on closed Auctions:
if(auction.status === 'closed'){
  throw new createError.Forbidden('you cannot bid on closed auction!!!!!!');
};
 try{
    const result = await DocumentClient.update(params).promise();
    updatedAuction = result.Attributes;
    } catch(error) {
      console.error(error);
      throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
   };
};

export const handler = commonMiddleware(placingBid);
