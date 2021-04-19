const BaseController = require('./../base/base.controller');
const msj = require('./../../shared/msj.shared');
const model = require('./user.model');

class UserController extends BaseController {
  static currentInstance = new UserController();

  getAll(req, res) {
    const _this = UserController.currentInstance;
    const fromOf = parseInt(req.query.fromOf) || 0;

    model.find({}, _this.userData)
      .skip(fromOf)
      .limit(5)
      .populate(`role`)
      .exec(
        (err, users) => {
          if (err) {
            return msj.sendDataBaseError(res, err);
          }
          model.countDocuments({}, (err, count) => {
            if (err) {
              return msj.sendDataBaseError(res, err);
            }
            const data = {
              usersLength: count,
              users
            }
            msj.sendData(res, data);
          });
        });
  }

  getById(req, res) {
    const id = req.params.id;
    console.log(id);

    model.findById({_id: id})
      .exec((err, user) => {
        if (err) {
          return msj.badRequestData(res, `Search user error`, err);
        }
        if (!user) {
          msj.notFountData(res, `User id`, id);
        }
        msj.sendData(res, {user, uid: req.uid});
      });
  }

  register(req, res) {
    const body = req.body;
    const newUser = new model(body);
    newUser.setPassword();
    newUser.save((err, createdUser) => {
      if (err) {
        return msj.badRequestData(res, `Error en el registro de usuario`, err);
      }

      msj.createdData(res, createdUser);
    });
  }

  updateById(req, res) {
    const id = req.params.id;
    const body = req.body;
    model.findById({ _id: id })
      .exec((err, match) => {
        
        if (err) {
          return msj.badRequestData(res, `Search user error`, err);
        }
        if (!match) {
          return msj.notFountData(res, `User id`, id);
        }
        match.updateData(body);
        match.save((err, updatedUser) => {
          if (err) {
            return msj.badRequestData(res, `Update user error`, err);
          }
          match.populate(`role`, (err, updated) => {
            if (err) {
              return msj.badRequestData(res, `Update user error`, err);
            }
            return msj.sendData(res, updated);
          });
        });
      });
  }

  deleteById(req, res) {
    const id = req.params.id;
    model.findByIdAndRemove(id, (err, deletedUser) => {
      if (err) {
        return msj.badRequestData(res, `Search user by id error`, err);
      }
      if (!deletedUser) {
        msj.notFountData(res, `User not registered`, `User`);
      }
      msj.sendData(res, deletedUser);
    });
  }
}

// Export

module.exports = UserController.currentInstance;