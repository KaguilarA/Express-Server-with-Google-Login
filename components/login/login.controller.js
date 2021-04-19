const BaseController = require('./../base/base.controller');
const googleVerify = require('./../../helpers/google.helper');
const exceptionManager = require('./../../shared/msj.shared');
const auth = require('./../../helpers/auth.helper');
const {getMenu} =require('./../../helpers/sidebar.helper')
const UserModel = require('../user/user.model');

class LoginController extends BaseController {
  static currentInstance = new LoginController();
  credentialsError = {
    message: `Wrong credentials`
  }
  name = 'LogIn'

  logIn(req, res) {
    const _this = LoginController.currentInstance;
    const body = req.body;

    UserModel.findOne({
        email: body.email
      })
      .exec((err, userMatch) => {

        if (err) {
          return exceptionManager.sendDataBaseError(res, err);
        }

        if (!userMatch) {
          return exceptionManager.badRequestData(res, `User not registered`, _this.credentialsError);
        }

        const isMatchPass = userMatch.comparePassword(body.password);

        if (!isMatchPass) {
          return exceptionManager.badRequestData(res, `Wrong credentials`, _this.credentialsError);
        }

        auth.generateToken(userMatch._id).then(token => {
          userMatch.populate(`role`).populate(``, (err, updated) => {
            updated.password = ``;
            const data = {
              token,
              match: {
                user: updated,
                menu: getMenu(updated.role)
              }
            }
            if (err) {
              return exceptionManager.sendDataBaseError(res, err);
            }
            return exceptionManager.sendData(res, data);
          });
          
        }).catch(err => {
          console.log(err);
        });
      });
  }

  logInGoogle(req, res) {
    const _this = LoginController.currentInstance;
    const token = req.body.token;

    googleVerify(token).then(user => {
      UserModel.findOne({
          email: user.email
        })
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
                return exceptionManager.badRequestData(res, _this.name, err);
              }
              auth.generateToken(updatedUser._id).then(token => {
                updatedUser.populate(`role`).populate(``, (err, updated) => {
                  updated.password = ``;
                  const data = {
                    token,
                    match: {
                      user: updated,
                      menu: getMenu(updated.role)
                    }
                  }
                  if (err) {
                    return exceptionManager.sendDataBaseError(res, err);
                  }
                  return exceptionManager.sendData(res, data);
                });
              });
            });
          });
    });
  }

  renewToken(req, res) {
    const _this = LoginController.currentInstance;
    const uid = req.uid;
    UserModel.findOne({
        _id: uid
      }, _this.userData)
      .exec((err, userMatch) => {

        if (err) {
          return exceptionManager.sendDataBaseError(res, err);
        }

        if (!userMatch) {
          return exceptionManager.badRequestData(res, `User not registered`, _this.credentialsError);
        }
        auth.generateToken(uid).then((token) => {
          userMatch.populate(`role`).populate(``, (err, updated) => {
            updated.password = ``;
            const data = {
              token,
              match: {
                user: updated,
                menu: getMenu(updated.role)
              }
            }
            if (err) {
              return exceptionManager.sendDataBaseError(res, err);
            }
            return exceptionManager.sendData(res, data);
          });
        });
      });
  }
}

module.exports = LoginController.currentInstance;