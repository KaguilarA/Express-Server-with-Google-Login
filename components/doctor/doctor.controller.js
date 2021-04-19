const BaseController = require('./../base/base.controller');
const exceptionManager = require('./../../shared/msj.shared');
const model = require('./doctor.model');

class DoctorController extends BaseController {
  static currentInstance = new DoctorController();

  getAll(req, res) {
    const _this = DoctorController.currentInstance;
    const fromOf = parseInt(req.query.fromOf) || 0;

    model.find({}, _this.doctorData)
      .populate(`userCreatorId`, _this.userData)
      .populate(`hospitalId`, _this.hospitalData)
      .skip(fromOf)
      .limit(5)
      .exec((err, doctors) => {
        if (err) {
          return exceptionManager.sendDataBaseError(res, err);
        }
        model.countDocuments({}, (err, count) => {
          if (err) {
            return exceptionManager.sendDataBaseError(res, err);
          }
          const data = {
            doctorsLength: count,
            doctors
          }
          return exceptionManager.sendData(res, data);
        });

      });
  }

  getById(req, res) {
    const _this = DoctorController.currentInstance;
    const id = req.params.id;
    model.findById({_id: id}, _this.doctorData)
      .populate(`userCreatorId`, _this.userData)
      .populate(`hospitalId`, _this.hospitalData)
      .exec((err, doctor) => {
        if (err) {
          return exceptionManager.badRequestData(res, `Search doctor error`, err);
        }
        if (!doctor) {
          return exceptionManager.notFountData(res, `Doctor id`, id);
        }
        return exceptionManager.sendData(res, doctor);
      });
  }

  register(req, res) {
    const body = req.body;
    body.userCreatorId = req.uid.uid;
    const newDoctor = new model(body);
    newDoctor.save((err, createdDoctor) => {
      if (err) {
        return exceptionManager.badRequestData(res, `Register doctor error`, err);
      }
      return exceptionManager.createdData(res, createdDoctor);
    });
  }

  updateById(req, res) {
    const _this = DoctorController.currentInstance;
    const id = req.params.id;
    const body = req.body;
    model.findById({ _id: id })
      .exec((err, match) => {
        if (err) {
          return exceptionManager.badRequestData(res, `Search doctor error`, err);
        }
        if (!match) {
          return exceptionManager.notFountData(res, `Doctor id`, id);
        }
        match.updateData(body);
        match.save((err, done) => {
          if (err) {
            return exceptionManager.badRequestData(res, `Update doctor error`, err);
          }

          match.populate(`hospitalId`, _this.hospitalData)
            .populate('', (err, updatedDoctor) => {
              if (err) {
                return exceptionManager.badRequestData(res, `Update doctor error`, err);
              }
              return exceptionManager.sendData(res, updatedDoctor);
            });

          
        });
      });
  }

  delete(req, res) {
    const id = req.params.id;
    model.findByIdAndRemove(id, (err, deletedDoctor) => {
      if (err) {
        return exceptionManager.badRequestData(res, `Search doctor by id error`, err);
      }
      if (!deletedDoctor) {
        return exceptionManager.notFountData(res, `Doctor not registered`, `Doctor`);
      }
      return exceptionManager.sendData(res, deletedDoctor);
    });
  }
}

module.exports = DoctorController.currentInstance;