const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '888996908916-k00si3p1d64h87c81aaj8u6flbannfqt.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04lrnv2yH8gMGCgYIARAAGAQSNwF-L9Ir223bxpEgU5v2L46fg8OzC_RGVKZGIwnZwdRy8PX74qaDcZ0Fzv5KQf9Uk3x9d-edIlk';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendMail(name,email,message) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'binfluence.aus@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: email,
      to: 'binfluence.aus@gmail.com',
      subject: 'Hello there is a new feedback',
      text: message,
      html: `<h1>Here is a new feedback from ${name} -- ${message}</h1>`,
    };

    const result = await transport.sendMail(mailOptions);
    console.log("response in mailer",result);
    return result;
  } catch (error) {
    return error;
  }
}
