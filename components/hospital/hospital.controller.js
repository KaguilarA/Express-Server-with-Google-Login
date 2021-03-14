// Requires
const exceptionManager = require('./../../shared/msj.shared');

// Model
const HospitalModel = require('./hospital.model');

// Consts
const userFilterData = `firstName secondName firstSurname secondSurname email`;

// Class

class HospitalController {

  getAll(req, res) {
    const fromOf = parseInt(req.query.fromOf) || 0;
    HospitalModel.find({})
      .populate(`userCreatorId`, userFilterData)
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
          exceptionManager.sendData(res, data);
        });
    });
  }

  getById(req, res) {
    const id = req.params.id;
    HospitalModel.findById(id)
      .populate(`userCreatorId`, userFilterData)
      .exec((err, hospital) => {
        if (err) {
          return exceptionManager.badRequestData(res, `Search hospital error`, err);
        }
        if (!hospital) {
          return exceptionManager.notFountData(res, `Hospital id`, id);
        }
        exceptionManager.sendData(res, hospital);
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
      exceptionManager.createdData(res, createdHospital);
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
        hospital.save((err, updatedHospital) => {
          if (err) {
            return exceptionManager.badRequestData(res, `Update hospital error`, err);
          }
          exceptionManager.sendData(res, updatedHospital);
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
      exceptionManager.sendData(res, deletedHospital);
    });
  }

}

// Export

const controller = new HospitalController();

module.exports = controller;