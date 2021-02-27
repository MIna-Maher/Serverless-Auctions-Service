import aws from 'aws-sdk';
var ses = new aws.SES();//ses client to use ses sevice to send emails
async function SendingEmail(event, context) {
   const SQSRecord = event.Records[0]; // array of messages/records in SQS (Batsh is 1 );
            console.log("Processing Messages>>",SQSRecord);
   const email = JSON.parse(SQSRecord.body);
   const { subject, body, recipient } = email;
    var params = {
        Destination: {
         ToAddresses: [recipient]
        },
        Message: {
         Body: {
          Html: {
           Charset: "UTF-8",
           Data: body,
          },
          Text: {
           Charset: "UTF-8",
           Data: body,
          }
         },
         Subject: {
          Charset: "UTF-8",
          Data: subject,
         }
        },
        Source: process.env.SENDER_MAIL
       };
       try{
        const result = await ses.sendEmail(params).promise();
        console.log(result);
        } catch(error) {
          console.error(error);
    }
}
export const handler = SendingEmail;