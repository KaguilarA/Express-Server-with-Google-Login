// Requires
const msj = require('./../../shared/msj.shared');

// Model
const UserModel = require('./user.model');
const userData = `firstName secondName firstSurname secondSurname img email role`;

// Class Controller

class UserController {

  getAll(req, res) {
    const fromOf = parseInt(req.query.fromOf) || 0;

    UserModel.find({}, userData)
      .skip(fromOf)
      .limit(5)
      .exec(
        (err, users) => {
          if (err) {
            return msj.sendDataBaseError(res, err);
          }
          UserModel.countDocuments({}, (err, count) => {
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

    UserModel.findById({_id: id})
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
    const newUser = new UserModel(body);
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
    UserModel.findById(id).exec((err, user) => {
      if (err) {
        return msj.badRequestData(res, `Search user error`, err);
      }
      if (!user) {
        return msj.notFountData(res, `User id`, id);
      }
      for (const key in body) {
        if (body[key] !== undefined) {
          const currentData = body[key];
          user[key] = currentData;
        }
      }
      user.save((err, updatedUser) => {
        if (err) {
          return msj.badRequestData(res, `Update user error`, err);
        }
        msj.sendData(res, updatedUser);
      });
    });
  }

  deleteById(req, res) {
    const id = req.params.id;
    UserModel.findByIdAndRemove(id, (err, deletedUser) => {
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

const controller = new UserController();

module.exports = controller;