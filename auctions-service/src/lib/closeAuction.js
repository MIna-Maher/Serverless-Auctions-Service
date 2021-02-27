import AWS from 'aws-sdk';
const sqs = new AWS.SQS();
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
      await DocumentClient.update(params).promise();
      const {title, SellerName, highestBid} = auction;
      const {amount, bidder} = auction.highestBid;
      // Validating No Bids cases
      if(amount == 0){
        await sqs.sendMessage({
          QueueUrl: process.env.SQS_MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'Sorry for That, No Bids on your Auction',
          body: `unfortunately, your Auction ${title} didn't get any Bidding, Good Luck next time!! `,
          recipient: SellerName,
        })
        }).promise();
        return;
      }
      const notifySeller = await sqs.sendMessage({
        QueueUrl: process.env.SQS_MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'Congratulations!!! your Item has been sold!!!',
          body: `WOOOOW, your item has been sold with "${highestBid.amount}"`,
          recipient: SellerName,
        })
      }).promise();
      const notifyBidder = await sqs.sendMessage({
        QueueUrl: process.env.SQS_MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'Congrats you won the auction!!!',
          body: `You did it , you won the auction "${title}" with amount of "${amount}" `,
          recipient: bidder
        })
      }).promise();
   return Promise.all([notifyBidder, notifySeller]);
 };