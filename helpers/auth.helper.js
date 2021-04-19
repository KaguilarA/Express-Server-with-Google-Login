require('dotenv').config();
const jwt = require('jsonwebtoken');
const msj = require('../shared/msj.shared');

const userModel = require('./../components/user/user.model');
const roleModel = require('./../components/role/role.model');

class AuthHelper {
  static currentInstance = new AuthHelper();

  validateAdminRole(req, res, next) {
    const uid = req.uid;

    userModel.findById({ _id: uid })
      .exec((err, user) => {
        if (err) {
          msj.unauthorizedRequestData(res, `Invalid token`, err);
          next();
        }
        roleModel.find({})
          .exec((err, roles) => {
            if (err) {
              msj.unauthorizedRequestData(res, `Invalid token`, err);
              next();
            }
            let role;
            for (let i = 0; i < roles.length; i++) {
              const currentRole = roles[i];
              if (`${currentRole._id}` === `${user.role}`) {
                role = currentRole;
              }
            }
            if (role.id === 0) {
              next();
            } else {
              msj.unauthorizedRequestData(res, `Invalid role`, err);
              next();
            }
          });
      });
  }

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