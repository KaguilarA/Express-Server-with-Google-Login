// Requires
const cloudinary = require('./../../helpers/cloudinary.helper');
const msj = require('./../../shared/msj.shared');

// Models
const HospitalModel = require('./../hospital/hospital.model');
const DoctorModel = require('./../doctor/doctor.model');
const UserModel = require('./../user/user.model');

class UploadImageController {
  static currentInstance = new UploadImageController();

  getModel(dataType) {
    let currentModel;

    switch (dataType) {
      case 'hospital':
        currentModel = HospitalModel;
        break;

      case 'doctor':
        currentModel = DoctorModel;
        break;

      default:
        currentModel = UserModel;
        break;
    }

    return currentModel;
  }

  upImage(req, res) {
    const _this = UploadImageController.currentInstance;
    const file = req.file;
    const type = req.params.type;
    const dataId = req.params.id;

    cloudinary.uploader.upload(file.path).then(done => {
      return _this.updateFile(res, dataId, type, done.secure_url, done.public_id);
    });
  }

  updateAndSave(identity, dataType, res, imgUrl, imgId) {
    identity.img = imgUrl;
    identity.img_id = imgId;

    identity.save((err, matchUpdated) => {
      if (err) {
        return msj.badRequestData(res, `Update ${dataType} error`, err);
      }

      const data = {
        message: `Updated image ${dataType}`,
        updated: matchUpdated
      }

      return msj.sendData(res, data);
    });
  }

  updateFile(res, id, dataType, imgUrl, imgId) {
    const _this = UploadImageController.currentInstance;

    _this.getModel(dataType).findById(id).exec((err, match) => {
      if (err) {
        return msj.badRequestData(res, `Search ${dataType} error`, err);
      }

      if (match.img_id !== ``) {
        cloudinary.uploader.destroy(match.img_id).then(() => {
          return _this.updateAndSave(match, dataType, res, imgUrl, imgId);
        });
      } else {
        return _this.updateAndSave(match, dataType, res, imgUrl, imgId);
      }
    });
  }
}

// Exports

module.exports = UploadImageController.currentInstance;