const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


async function googleVerify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const userData = {
    firstName: payload.given_name,
    firstSurname: payload.family_name,
    email: payload.email,
    img: payload.picture,
    password: `@@@`,
    googleTokenLogin: true,
    role: 1
  }

  // console.log('userData: ', userData);

  // console.log('payload: ', payload);

  return userData;
}

module.exports = googleVerify;
