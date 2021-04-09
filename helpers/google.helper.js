require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function googleVerify(token) {
  return new Promise(resolve => {

    const googleTickerData = {
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    }

    client.verifyIdToken(googleTickerData).then(tickerData => {
      const googleUserData = tickerData.getPayload();

      const newUserData = {
        firstName: googleUserData.given_name,
        firstSurname: googleUserData.family_name,
        email: googleUserData.email,
        img: googleUserData.picture,
        password: `@@@`,
        googleTokenLogin: true,
        role: 1
      }

      resolve(newUserData);
    });
  });
}

module.exports = googleVerify;
