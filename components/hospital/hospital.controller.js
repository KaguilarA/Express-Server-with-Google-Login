const BaseController = require('./../base/base.controller');
const exceptionManager = require('./../../shared/msj.shared');
const HospitalModel = require('./hospital.model');

class HospitalController extends BaseController {
  static currentInstance = new HospitalController();

  getAll(req, res) {
    const _this = HospitalController.currentInstance;
    const fromOf = parseInt(req.query.fromOf) || 0;
    HospitalModel.find({}, _this.hospitalData)
      .populate(`userCreatorId`, _this.userData)
      .skip(fromOf)
      .limit(5)
      .exec((err, hospitals) => {
        if (err) {
          return exceptionManager.sendDataBaseError(res, err);
        }
        HospitalModel.countDocuments({}, (err, count) => {
          if (err) {
            return exceptionManager.sendDataBaseError(res, err);
          }
          const data = {
            hospitalsLength: hospitals.length,
            hospitals
          }
          return exceptionManager.sendData(res, data);
        });
    });
  }

  getById(req, res) {
    const _this = HospitalController.currentInstance;
    const id = req.params.id;
    HospitalModel.findById(id, _this.hospitalData)
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
    const newHospital = new HospitalModel(body);
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
    HospitalModel.findById(id)
      .exec((err, hospital) => {
        if (err) {
          return exceptionManager.badRequestData(res, `Search hospital error`, err);
        }
        if (!hospital) {
          return exceptionManager.notFountData(res, `Hospital id`, id);
        }
        for (const key in body) {
          if (body[key] !== undefined) {
            const currentData = body[key];
            hospital[key] = currentData;
          }
        }
        return hospital.save((err, updatedHospital) => {
          if (err) {
            return exceptionManager.badRequestData(res, `Update hospital error`, err);
          }
          return exceptionManager.sendData(res, updatedHospital);
        });
      });
  }

  delete(req, res) {
    const id = req.params.id;
    HospitalModel.findByIdAndRemove(id, (err, deletedHospital) => {
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