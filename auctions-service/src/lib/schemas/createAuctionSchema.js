const createAuctionSchame = {
    properties: {
      body: {//according to my need , for ex: if i want to validate the event.body
        type: 'object',
        properties: {
          title: {
            type: 'string',
            //enum: ['OPEN', 'CLOSED'],
            //default: 'OPEN',
          },
        },
        required: ['title'],
      },
    },
    required: ['body'], //i want the body to be required.
  };
  export default createAuctionSchame;//default export