import { v4 as auctionId  } from 'uuid';  //importing V4 from UUID and assign it to auctionID
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';// //Default export.then you can import that default export by omitting the curly braces:
const DocumentClient = new AWS.DynamoDB.DocumentClient(); //DocumentClient fot Connecting to DynamoDB and insert tables
async function createAuction(event, context) { // those arguments will be provided when lambda executed.
  const { title } = event.body;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() +1 );
  //converts the response from Json string into Java array of objects
  const auction = {  //define new object for the auction
    title,
    id: auctionId(),
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingDate: endDate.toDateString(),
    highestBid: {
      amount: 0
    }
  };
  await DocumentClient.put( {
    TableName : process.env.AUCTION_TABLE_NAME,
    Item : auction,
  }).promise();
  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler =commonMiddleware(createAuction);
