require('dotenv').config();
const jwt = require('jsonwebtoken');
const msj = require('../shared/msj.shared');

class AuthHelper {
  static currentInstance = new AuthHelper();

  validateToken(req, res, next) {
    const token = req.header(`x-token`);
    if (!token) {
      msj.forbiddenRequestData(res, `Invalid token`, 'Empty-Data');
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          msj.unauthorizedRequestData(res, `Invalid token`, err);
          next();
        }
        req.uid = decode.uid;
        next();
      });
    }
  }

  generateToken(uid) {
    return new Promise((resolve, reject) => {
      const  payload = {uid}
      jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '12h'
      }, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  }
}

module.exports = AuthHelper.currentInstance;