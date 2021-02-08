const getAuctionsSchame = {
    properties: {
      queryStringParameters: {//according to my need , for ex: if i want to validate the event.body
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['OPEN', 'CLOSED'],
            default: 'OPEN',
          },
        },
      },
    },
    required: [
      'queryStringParameters',
    ],
  };
  export default getAuctionsSchame;//default export