import { getEndedAuctions } from '../lib/getEndedAuctions';
import createError from 'http-errors';
import { closeAuction } from '../lib/closeAuction';
async function processingAuctions(event, context) {
    try {
     const endedAuctions = await getEndedAuctions();
     const closeAuctionsStatus = endedAuctions.map(auction => closeAuction(auction));
     await Promise.all(closeAuctionsStatus);
    return { closed: closeAuctionsStatus.length };
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
      }
}
  export const handler = processingAuctions;