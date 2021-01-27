import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
var createError = require('http-errors');
const DocumentClient = new AWS.DynamoDB.DocumentClient(); //DocumentClient fot Connecting to DynamoDB and insert tables
export async function getAuctionByIdValidation(id){
  let auction;  //defining auction and can be assigned later.
      try{
       const result = await DocumentClient.get({
          TableName: process.env.AUCTION_TABLE_NAME,
          Key: { id }, //ES6 feature {id: id}
          }
          ).promise();
       auction = result.Item;
        } catch(error) {
         console.error(error);
          throw new createError.InternalServerError(error);
          }
            if(!auction) {
              throw new createError.NotFound(`So Sorry your request with "${id}" Not Found`);
            };
            return auction;
}
async function getAuctionById(event, context) { // those arguments will be provided when lambda executed.
  const { id } = event.pathParameters;
  const auction = await  getAuctionByIdValidation(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
   };
};

export const handler = commonMiddleware(getAuctionById);
