const BaseController = require('./../base/base.controller');
const exceptionManager = require('./../../shared/msj.shared');
const model = require('./hospital.model');

class HospitalController extends BaseController {
  static currentInstance = new HospitalController();

  getAll(req, res) {
    const _this = HospitalController.currentInstance;
    const fromOf = parseInt(req.query.fromOf) || 0;
    model.find({}, _this.hospitalData)
      .populate(`userCreatorId`, _this.userData)
      .skip(fromOf)
      .limit(5)
      .exec((err, hospitals) => {
        if (err) {
          return exceptionManager.sendDataBaseError(res, err);
        }
        model.countDocuments({}, (err, count) => {
          if (err) {
            return exceptionManager.sendDataBaseError(res, err);
          }
          const data = {
            hospitalsLength: count,
            hospitals
          }
          return exceptionManager.sendData(res, data);
        });
    });
  }

  getById(req, res) {
    const _this = HospitalController.currentInstance;
    const id = req.params.id;
    model.findById(id, _this.hospitalData)
      .populate(`userCreatorId`, _this.userData)
      .exec((err, hospital) => {
        if (err) {
          return exceptionManager.badRequestData(res, `Search hospital error`, err);
        }
        if (!hospital) {
          return exceptionManager.notFountData(res, `Hospital id`, id);
        }
        return exceptionManager.sendData(res, hospital);
      });
  }

  register(req, res) {
    const body = req.body;
    body.userCreatorId = req.uid.uid;
    const newHospital = new model(body);
    newHospital.save((err, createdHospital) => {
      if (err) {
        return exceptionManager.badRequestData(res, `Register hospital error`, err);
      }
      return exceptionManager.createdData(res, createdHospital);
    });
  }

  updateById(req, res) {
    const id = req.params.id;
    const body = req.body;
    model.findById({ _id: id})
      .exec((err, match) => {
        if (err) {
          return exceptionManager.badRequestData(res, `Search hospital error`, err);
        }
        if (!match) {
          return exceptionManager.notFountData(res, `Hospital id`, id);
        }
        match.updateData(body);
        match.save((err, updatedHospital) => {
          if (err) {
            return exceptionManager.badRequestData(res, `Update hospital error`, err);
          }
          return exceptionManager.sendData(res, updatedHospital);
        });
      });
  }

  delete(req, res) {
    const id = req.params.id;
    model.findByIdAndRemove(id, (err, deletedHospital) => {
      if (err) {
        return exceptionManager.badRequestData(res, `Search hospital by id error`, err);
      }
      if (!deletedHospital) {
        return exceptionManager.notFountData(res, `Hospital not registered`, `Hospital`);
      }
      return exceptionManager.sendData(res, deletedHospital);
    });
  }
}

module.exports = HospitalController.currentInstance;