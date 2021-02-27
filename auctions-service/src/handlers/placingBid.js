import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
var createError = require('http-errors');
import { getAuctionByIdValidation } from './getAuctionById';
const DocumentClient = new AWS.DynamoDB.DocumentClient(); //DocumentClient fot Connecting to DynamoDB and insert tables
async function placingBid(event, context) { // those arguments will be provided when lambda executed.
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const { email } = event.requestContext.authorizer;//taking the identity of the seller(Authenticator);//part of claims//you can get list of claimsfrom https://jwt.io/

    const params = {
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
        ExpressionAttributeValues: {
          ':amount': amount,
          ':bidder': email,
        },
        ReturnValues: 'ALL_NEW'
    };

    let updatedAuction;
const auction = await getAuctionByIdValidation(id);//calling function

//Validating Bidding on my auction!!!
if(auction.SellerName === email){
  throw new createError.Forbidden('No NO No so sorry, you cannot bid on your Auction!!!!');
};
//validating not double bidding
if(auction.highestBid.bidder === email){
  throw new createError.Forbidden('Please STOP, you already the last Bidder and the highest Bidder');
}
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
