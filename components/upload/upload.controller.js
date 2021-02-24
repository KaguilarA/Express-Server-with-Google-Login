// Requires
const cloudinary = require('./../../helpers/cloudinary.helper');
const msj = require('./../../shared/msj.shared');

// Models
const HospitalModel = require('./../hospital/hospital.model');
const DoctorModel = require('./../doctor/doctor.model');
const UserModel = require('./../user/user.model');

// Functions
function getModel(dataType) { 
  let currentModel;

  switch (dataType) {
    case 'hospitals':
      currentModel = HospitalModel;
      break;

    case 'doctors':
      currentModel = DoctorModel;
      break;

    default:
      currentModel = UserModel;
      break;
  }

  return currentModel;
}

function updateAndSave(identity, dataType, res, imgUrl, imgId) { 
  identity.img = imgUrl;
  identity.img_id = imgId;

  identity.save((err, matchUpdated) => {
    if (err) {
      msj.badRequestData(res, `Update ${dataType} error`, err);
    }

    const data = {
      message: `Updated image ${dataType}`,
      matchUpdated
    }

    msj.sendData(res, data);
  });
}

function updateFile(res, id, dataType, imgUrl, imgId) {
  getModel(dataType).findById(id).exec((err, match) => {
    if (err) {
      msj.badRequestData(res, `Search ${dataType} error`, err);
    }

    if (match.img_id !== ``) {
      cloudinary.uploader.destroy(match.img_id).then(() => {
        updateAndSave(match, dataType, res, imgUrl, imgId);
      });
    } else {
      updateAndSave(match, dataType, res, imgUrl, imgId);
    }
  });
}

class UploadImageController {
  upImage(req, res) {
    const file = req.file;
    const type = req.params.type;
    const dataId = req.params.id;

    cloudinary.uploader.upload(file.path).then(done => {

      updateFile(res, dataId, type, done.secure_url, done.public_id);

    });
  }
}

// Exports

const controller = new UploadImageController();

module.exports = controller;