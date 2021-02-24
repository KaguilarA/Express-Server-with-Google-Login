// Models
const HospitalModel = require('./../hospital/hospital.model');
const DoctorModel = require('./../doctor/doctor.model');
const UserModel = require('./../user/user.model');

// Consts
const userFormatted = `firstName secondName firstSurname secondSurname email -_id`;
const hospitalFormatted = `name img id -_id`;

// Class

class PromisesController {

  searchHospital(regex, count) {
    return new Promise((resolve, reject) => {
      HospitalModel.find({
          name: regex
      }, `-__v`)
        .skip(count)
        .limit(5)
        .populate('userCreatorId', userFormatted)
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
        .populate(`hospitalId`, hospitalFormatted)
        .populate(`userCreatorId`, userFormatted)
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
    return new Promise((resolve, reject) => {
      UserModel.find({}, userFormatted)
        .skip(count)
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

const controller = new PromisesController();

module.exports = controller;