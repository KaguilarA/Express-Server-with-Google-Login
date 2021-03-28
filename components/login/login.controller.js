// Requires
const googleVerify = require('./../../helpers/google.helper');
const exceptionManager = require('./../../shared/msj.shared');
const auth = require('./../../helpers/auth.helper');

// Models
const UserModel = require('../user/user.model');


// Const
const credentialsError = {
  message: `Wrong credentials`
}
const userDataFilter = `firstName secondName firstSurname secondSurname img email role googleTokenLogin`;

class LoginController {
  logIn(req, res) {
    const body = req.body;

    UserModel.findOne({ email: body.email })
      .exec((err, userMatch) => {

        if (err) {
          return exceptionManager.sendDataBaseError(res, err);
        }

        if (!userMatch) {
           return exceptionManager.badRequestData(res, `User not registered`, credentialsError);
        }

        const isMatchPass = userMatch.comparePassword(body.password);

        if (!isMatchPass) {
          return exceptionManager.badRequestData(res, `Wrong credentials`, credentialsError);
        }

        auth.generateToken(userMatch._id).then(token => {
          userMatch.password = ``;
          const data = {
            token,
            user: userMatch
          }
          return exceptionManager.sendData(res, data);
        }).catch(err => {
          console.log(err);
        }); 
      });
  }

  logInGoogle(req, res) {
    const token = req.body.token;

    googleVerify(token).then(user => {
      UserModel.findOne({ email: user.email })
        .exec(
          (err, userFind) => {
            let newUser;
          
            if (err) {
              return msj.sendDataBaseError(res, err);
            }

            if (!userFind) {
              newUser = new UserModel(user);
            } else {
              userFind.setGoogleLogin();
              newUser = userFind;
            }

            newUser.save((err, updatedUser) => {
              if (err) {
                return exceptionManager.badRequestData(res, `Login error`, err);
              }
              auth.generateToken(updatedUser._id).then(token => {
                updatedUser.password = "";
                const data = {
                  token,
                  user: updatedUser
                }
                return exceptionManager.sendData(res, data);
              });
            });
          });
    });
  }

  renewToken(req, res) {
    const uid = req.uid;
    UserModel.findOne({ _id: uid }, userDataFilter)
      .exec((err, userMatch) => {

      if (err) {
        return exceptionManager.sendDataBaseError(res, err);
      }

      if (!userMatch) {
        return exceptionManager.badRequestData(res, `User not registered`, credentialsError);
      }
      auth.generateToken(uid).then((token) => {
        const data = {
          token,
          user: userMatch
        }
        return exceptionManager.sendData(res, data);
      });
    });
  }
}

// Export

const controller = new LoginController();

module.exports = controller;