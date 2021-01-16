async function createAuction(event, context) { // those arguments will be provided when lambda executed.
  const { title } = JSON.parse(event.body);
  const now = new Date();
  //converts the response from Json string into Java array of objects
  const auction = {  //define new object for the auction
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
  };
  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = createAuction;
