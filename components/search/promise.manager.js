// Models
const HospitalModel = require('./../hospital/hospital.model');
const DoctorModel = require('./../doctor/doctor.model');
const UserModel = require('./../user/user.model');

// Class

class PromisesController {
  static currentInstance = new PromisesController();
  userData = `firstName secondName firstSurname secondSurname img email role googleTokenLogin`;
  hospitalData = `name img id -_id`;

  searchHospital(regex, count) {
    const _this = PromisesController.currentInstance;
    return new Promise((resolve, reject) => {
      HospitalModel.find({
          name: regex
      }, `-__v`)
        .skip(count)
        .limit(5)
        .populate('userCreatorId', _this.userData)
        .exec((err, hospitals) => {
          if (err) {
            reject(err);
          } else {
            resolve(hospitals);
          }
        });
    });
  }

  searchDoctor(regex, count) {
    const _this = PromisesController.currentInstance;
    return new Promise((resolve, reject) => {
      DoctorModel.find({}, `-__v`)
        .skip(count)
        .limit(5)
        .or([{
          firstName: regex
        }, {
          firstSurname: regex
        }, {
          secondName: regex
        }, {
          secondSurname: regex
        }])
        .populate(`hospitalId`, _this.hospitalData)
        .populate(`userCreatorId`, _this.userData)
        .exec((err, doctors) => {
          if (err) {
            reject(err);
          } else {
            resolve(doctors);
          }
        });
    });
  }

  searchUser(regex, count) {
    const _this = PromisesController.currentInstance;
    return new Promise((resolve, reject) => {
      UserModel.find({}, _this.userData)
        .skip(count)
        .populate(`role`)
        .limit(5)
        .or([{
          firstName: regex
        }, {
          firstSurname: regex
        }, {
          email: regex
        }, {
          secondSurname: regex
        }, {
          secondName: regex
        }])
        .exec((err, users) => {
          if (err) {
            reject(err);
          } else {
            resolve(users);
          }
        });
    });
  }
}

// Exports

module.exports = PromisesController.currentInstance;