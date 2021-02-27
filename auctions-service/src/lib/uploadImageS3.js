import AWS from 'aws-sdk';
const s3Client = new AWS.S3();
export async function uploadImageS3(key, body){
    const result = await s3Client.upload({
        Bucket: process.env.AUCTIONS_S3_BUCKET,
        Key: key,
        Body: body,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      }).promise();
      return result.Location;
}
