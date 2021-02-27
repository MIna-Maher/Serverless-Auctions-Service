import AWS from 'aws-sdk';
const DocumentClient = new AWS.DynamoDB.DocumentClient(); //DocumentClient fot Connecting to DynamoDB and insert tables
export async function setAuctionPictureUrl(id, uploadedImageUrl){
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set auctionPictureUrl = :url',
        ExpressionAttributeValues: {
          ':url': uploadedImageUrl,
        },
        ReturnValues: 'ALL_NEW'
    };
  const result = await DocumentClient.update(params).promise();
    return result.Attributes;
};
