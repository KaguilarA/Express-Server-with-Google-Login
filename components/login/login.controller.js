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

class LoginController {
  logIn(req, res) {
    const body = req.body;

    UserModel.findOne({ email: body.email })
      .exec((err, userMatch) => {

        if (err) {
          exceptionManager.sendDataBaseError(res, err);
        }

        if (!userMatch) {
           exceptionManager.badRequestData(res, `User not registered`, credentialsError);
        }

        const isMatchPass = userMatch.comparePassword(body.password);

        if (!isMatchPass) {
          exceptionManager.badRequestData(res, `Wrong credentials`, credentialsError);
        }

        auth.generateToken(userMatch._id).then(token => {
          userMatch.password = ``;
          const data = {
            token,
            user: userMatch
          }
          exceptionManager.sendData(res, data);
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
              msj.sendDataBaseError(res, err);
            }

            if (!userFind) {
              newUser = new UserModel(user);
            } else {
              userFind.setGoogleLogin();
              newUser = userFind;
            }

            newUser.save((err, updatedUser) => {
              if (err) {
                exceptionManager.badRequestData(res, `Login error`, err);
              }
              auth.generateToken(updatedUser._id).then(token => {
                updatedUser.password = "";
                const data = {
                  token,
                  user: updatedUser
                }
                exceptionManager.sendData(res, data);
              });
            });
          });
    });
  }
}

// Export

const controller = new LoginController();

module.exports = controller;