import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';
import { getAuctionByIdValidation } from '../handlers/getAuctionById';
import { uploadImageS3 } from '../lib/uploadImageS3';
import { setAuctionPictureUrl } from '../lib/setAuctionPictureUrl';
import createHttpError from 'http-errors';
async function uploadAuctionPicture(event, context) { // those arguments will be provided when lambda executed.
  const { email } = event.requestContext.authorizer;//taking the identity of the seller(Authenticator);//part of claims//you can get list of claimsfrom https://jwt.io/
  const { id } = event.pathParameters;
  const auction = await getAuctionByIdValidation(id);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  let auctionWithUrl;
  /// Validating the identity of the auction image uploader///
  if(email !== auction.SellerName){
    throw new createHttpError.Forbidden('Please STOP, your are Not the seller to puload the image!!');
  };
  try {
  const uploadedImageUrl = await uploadImageS3(auction.id + '.jpg', buffer);
  //PictureURl uplading to DynamoDb
   auctionWithUrl = await setAuctionPictureUrl(auction.id, uploadedImageUrl);
  } catch(error){
    console.error(error);
    createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auctionWithUrl),
   };
};

export const handler = middy(uploadAuctionPicture)
 .use(httpErrorHandler());