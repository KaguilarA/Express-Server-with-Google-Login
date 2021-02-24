// Requires
const exceptionManager = require('./../../shared/msj.shared');

// Model
const DoctorModel = require('./doctor.model');

// Consts
const userFormatted = `firstName secondName firstSurname secondSurname email -_id`;
const hospitalFormatted = `name img id -_id`;

class DoctorController {
  getAll(req, res) {
    const fromOf = parseInt(req.query.fromOf) || 0;
    DoctorModel.find({}, `-__v`)
      .populate(`userCreatorId`, userFormatted)
      .populate(`hospitalId`, hospitalFormatted)
      .skip(fromOf)
      .limit(5)
      .exec((err, doctors) => {
        if (err) {
          return exceptionManager.sendDataBaseError(res, err);
        }
        DoctorModel.count({}, (err, count) => {
          if (err) {
            return exceptionManager.sendDataBaseError(res, err);
          }
          const data = {
            doctorsLength: count,
            doctors
          }
          exceptionManager.sendData(res, data);
        });
  
      });
  }

  getById(req, res) {
    const id = req.params.id;
    DoctorModel.findById({_id: id}, `-__v`)
      .populate(`userCreatorId`, userFormatted)
      .populate(`hospitalId`, hospitalFormatted)
      .exec((err, doctor) => {
        if (err) {
          return exceptionManager.badRequestData(res, `Search doctor error`, err);
        }
        if (!doctor) {
          return exceptionManager.notFountData(res, `Doctor id`, id);
        }
        console.log(doctor);
        exceptionManager.sendData(res, doctor);
      });
  }

  register(req, res) {
    const body = req.body;
    body.userCreatorId = req.uid.uid;
    const newDoctor = new DoctorModel(body);
    newDoctor.save((err, createdDoctor) => {
      if (err) {
        return exceptionManager.badRequestData(res, `Register doctor error`, err);
      }
      exceptionManager.createdData(res, createdDoctor);
    });
  }

  updateById(req, res) {
    const id = req.params.id;
    const body = req.body;
    DoctorModel.findById(id)
      .exec((err, doctor) => {
        if (err) {
          return exceptionManager.badRequestData(res, `Search doctor error`, err);
        }
        if (!doctor) {
          return exceptionManager.notFountData(res, `Doctor id`, id);
        }
        for (const key in body) {
          if (body[key] !== undefined) {
            const currentData = body[key];
            doctor[key] = currentData;
          }
        }
        doctor.save((err, updatedDoctor) => {
          if (err) {
            return exceptionManager.badRequestData(res, `Update doctor error`, err);
          }
          exceptionManager.sendData(res, updatedDoctor);
        });
      });
  }

  delete(req, res) {
    const id = req.params.id;
    DoctorModel.findByIdAndRemove(id, (err, deletedDoctor) => {
      if (err) {
        return exceptionManager.badRequestData(res, `Search doctor by id error`, err);
      }
      if (!deletedDoctor) {
        return exceptionManager.notFountData(res, `Doctor not registered`, `Doctor`);
      }
      exceptionManager.sendData(res, deletedDoctor);
    });
  }
}

// Export

const controller = new DoctorController();

module.exports = controller;