const msj = require('./../../shared/msj.shared');

const model = require('./role.model');

class RoleController {
  static currentInstance = new RoleController();
  name = 'Role';

  getAll(req, res) {
    const fromOf = parseInt(req.query.fromOf) || 0;

    model.find({})
      .skip(fromOf)
      .limit(5)
      .exec(
        (err, matchs) => {
          if (err) {
            return msj.sendDataBaseError(res, err);
          }
          model.countDocuments({}, (err, count) => {
            if (err) {
              return msj.sendDataBaseError(res, err);
            }
            const data = {
              count,
              matchs
            }
            msj.sendData(res, data);
          });
        });
  }

  getById(req, res) {
    const id = req.params.id;

    model.findById({_id: id})
      .exec((err, role) => {
        if (err) {
          return msj.badRequestData(res, `Search role error`, err);
        }
        if (!role) {
          msj.notFountData(res, `Role id`, id);
        }
        msj.sendData(res, {user: role, uid: req.uid});
      });
  }

  register(req, res) {
    const body = req.body;
    const newUser = new model(body);
    newUser.save((err, createdRole) => {
      if (err) {
        return msj.badRequestData(res, `Error en el registro de rol`, err);
      }

      msj.createdData(res, createdRole);
    });
  }

  update(req, res) {
    const id = req.params.id;
    const body = req.body;
    
    model.findById({_id: id})
      .exec((err, match) => {
        if (err) {
          return msj.badRequestData(res, `Search user error`, err);
        }
        if (!match) {
          return msj.notFountData(res, `User id`, id);
        }
        match.updateData(body);
        match.save((err, updated) => {
          if (err) {
            return msj.badRequestData(res, `Update user error`, err);
          }
          return msj.sendData(res, updated);
        });
      });
  }

  delete(req, res) {
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

module.exports = RoleController.currentInstance;